import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import { Session, Answer, Log, User } from '../../models/Schema';
import { USERS } from '../../constants';

// Populate Users if they don't exist (Seed)
async function ensureUsers() {
  for (const u of USERS) {
    const exists = await User.findById(u.id);
    if (!exists) {
      await User.create({ _id: u.id, ...u, createdAt: new Date() });
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  await dbConnect();
  await ensureUsers();

  const { action, payload, secret } = req.body;
  
  // Basic Security Check for Admin Actions
  if (['admin_stats', 'admin_reset', 'admin_reset_system'].includes(action)) {
    if (secret !== process.env.ADMIN_SECRET_KEY) {
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
          await session.save();
          await Log.create({ 
            userId, action: 'RESUME', timestamp: Date.now(), metadata: { type: 'existing' } 
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
        await Session.findOneAndUpdate(
          { userId },
          { 
            currentIndex,
            currentSection: section,
            lastActiveAt: Date.now(),
            $inc: { totalTimeSpent: timeSpent || 0 }
          }
        );
        
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
        await Session.deleteOne({ userId: targetUserId });
        await Answer.deleteMany({ userId: targetUserId });
        await Log.create({ 
          userId: targetUserId, action: 'ADMIN_RESET', timestamp: Date.now(), metadata: { by: adminId } 
        });
        return res.json({ success: true });
      }

      case 'admin_reset_system': {
        const { adminId } = payload;
        await Session.deleteMany({});
        await Answer.deleteMany({});
        await Log.deleteMany({});
        await Log.create({ 
          userId: 'SYSTEM', action: 'ADMIN_RESET', timestamp: Date.now(), metadata: { by: adminId, type: 'full' } 
        });
        return res.json({ success: true });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}