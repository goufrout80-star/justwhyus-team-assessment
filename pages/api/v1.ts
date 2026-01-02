import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import { Session, Answer, Log, User } from '../../models/Schema';
import { USERS } from '../../constants';

// Populate Users if they don't exist (Seed)
async function ensureUsers() {
  for (const u of USERS) {
    const byId = await User.findById(u.id);
    const byName = await User.findOne({ name: u.name });

    if (!byId && !byName) {
      // Brand new user
      await User.create({ _id: u.id, ...u, createdAt: new Date() });
    } else if (!byId && byName) {
      // Found user by name but with a different (likely legacy) ID. 
      // Migrate them to the new standardized ID (u1, u2, etc.)
      const oldId = byName._id;

      // 1. Create the new user record
      await User.create({ _id: u.id, ...u, createdAt: byName.createdAt });

      // 2. Migrate linked data
      await Session.updateMany({ userId: oldId }, { userId: u.id });
      await Answer.updateMany({ userId: oldId }, { userId: u.id });
      await Log.updateMany({ userId: oldId }, { userId: u.id });

      // 3. Delete old user record
      await User.deleteOne({ _id: oldId });

      console.log(`Migrated legacy user ${u.name} from ID ${oldId} to standardized ID ${u.id}`);
    } else if (byId && byName && byId._id !== byName._id) {
      // This is the duplication case: two records for one person.
      // We keep the one with progress (usually the legacy one) and merge it into the new ID.
      // Actually, let's just delete the extra one that has 0 progress.
      const answersCountOld = await Answer.countDocuments({ userId: byName._id });
      const answersCountNew = await Answer.countDocuments({ userId: byId._id });

      if (answersCountOld > answersCountNew) {
        // Keep the old one's data, but move it to the new ID
        await Session.deleteOne({ userId: byId._id });
        await Answer.deleteMany({ userId: byId._id });
        await Session.updateMany({ userId: byName._id }, { userId: u.id });
        await Answer.updateMany({ userId: byName._id }, { userId: u.id });
        await User.deleteOne({ _id: byName._id });
      } else {
        // New ID is more populated, just remove the duplicate
        await User.deleteOne({ _id: byName._id });
      }
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  await ensureUsers();

  const { action, payload, secret } = req.body;

  // Basic Security Check for Admin Actions
  const adminActions = ['admin_stats', 'admin_reset', 'admin_reset_system', 'admin_get_answers', 'admin_export'];
  if (adminActions.includes(action)) {
    const envSecret = process.env.ADMIN_SECRET_KEY;
    const fallbackSecret = "bS%83B4+4uAO-#&&UyK;H+";

    // Check if it matches either the ENV variable OR the hardcoded fallback
    if (secret !== envSecret && secret !== fallbackSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    switch (action) {
      case 'get_user_data': {
        const { userId } = payload;
        const user = await User.findById(userId);
        const session = await Session.findOne({ userId });
        const answers = await Answer.find({ userId });
        return res.json({ user, session, answers });
      }

      case 'start_session': {
        const { userId } = payload;
        let session = await Session.findOne({ userId });
        if (!session) {
          session = await Session.create({ userId });
          await Log.create({
            userId, action: 'LOGIN', timestamp: Date.now(), metadata: { type: 'new' }
          });
        } else {
          session.lastActiveAt = Date.now();
          session.loginCount = (session.loginCount || 0) + 1;
          await session.save();
          await Log.create({
            userId, action: 'RESUME', timestamp: Date.now(), metadata: { type: 'existing', count: session.loginCount }
          });
        }
        return res.json(session);
      }

      case 'update_language': {
        const { userId, language } = payload;
        await User.findByIdAndUpdate(userId, { language });
        return res.json({ success: true });
      }

      case 'save_progress': {
        const { userId, questionId, section, answerText, timeSpent, currentIndex } = payload;

        // 1. Save Answer
        await Answer.findOneAndUpdate(
          { userId, questionId },
          {
            section,
            answerText,
            $inc: { timeSpent: timeSpent || 0 }, // Accumulate time
            updatedAt: Date.now()
          },
          { upsert: true, new: true }
        );

        // 2. Update Session
        const updateObj: any = {
          currentIndex,
          currentSection: section,
          lastActiveAt: Date.now(),
          $inc: {
            totalTimeSpent: timeSpent || 0
          }
        };

        // Use $inc for nested section time
        if (section) {
          updateObj.$inc[`sectionTimes.${section}`] = timeSpent || 0;
        }

        await Session.findOneAndUpdate({ userId }, updateObj);

        return res.json({ success: true });
      }

      case 'log_event': {
        const { userId, event } = payload; // event could be 'backtrack' or 'blur'
        const field = event === 'backtrack' ? 'backtrackCount' : event === 'blur' ? 'blurCount' : null;
        if (field) {
          await Session.findOneAndUpdate({ userId }, { $inc: { [field]: 1 } });
        }
        return res.json({ success: true });
      }

      case 'heartbeat': {
        const { userId } = payload;
        await Session.findOneAndUpdate({ userId }, { lastActiveAt: Date.now() });
        return res.json({ success: true });
      }

      case 'complete_session': {
        const { userId } = payload;
        await Session.findOneAndUpdate({ userId }, { isCompleted: true, completedAt: Date.now() });
        await Log.create({ userId, action: 'COMPLETE', timestamp: Date.now() });
        return res.json({ success: true });
      }

      // --- Admin Actions ---

      case 'admin_stats': {
        const users = await User.find({});
        const sessions = await Session.find({});
        const answers = await Answer.find({}); // Optimization: could be aggressive for huge datasets, but fine for <100 users

        const stats = users.map(u => {
          const sess = sessions.find(s => s.userId === u._id.toString());
          const userAns = answers.filter(a => a.userId === u._id.toString());
          return {
            user: { id: u._id, name: u.name, role: u.role, language: u.language },
            session: sess ? sess.toObject() : null,
            answerCount: userAns.length,
            isOnline: sess ? (Date.now() - sess.lastActiveAt) < 30000 : false
          };
        });
        return res.json(stats);
      }

      case 'admin_get_answers': {
        const { userId } = payload;
        const answers = await Answer.find({ userId });
        return res.json(answers);
      }

      case 'admin_reset': {
        const { targetUserId, adminId } = payload;
        await User.deleteOne({ _id: targetUserId }); // Reset user metadata (language, etc)
        await Session.deleteOne({ userId: targetUserId });
        await Answer.deleteMany({ userId: targetUserId });
        await Log.create({
          userId: targetUserId, action: 'ADMIN_RESET', timestamp: Date.now(), metadata: { by: adminId }
        });
        return res.json({ success: true });
      }

      case 'admin_reset_system': {
        const { adminId } = payload;
        await User.deleteMany({}); // Wipe all user data
        await Session.deleteMany({});
        await Answer.deleteMany({});
        await Log.deleteMany({});
        await Log.create({
          userId: 'SYSTEM', action: 'ADMIN_RESET', timestamp: Date.now(), metadata: { by: adminId, type: 'full' }
        });
        return res.json({ success: true });
      }

      case 'admin_export': {
        const users = await User.find({});
        const sessions = await Session.find({});
        const answers = await Answer.find({});
        const logs = await Log.find({});
        return res.json({ users, sessions, answers, logs });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}