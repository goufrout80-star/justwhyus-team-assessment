import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import { Session, Answer, Log, User } from '../../models/Schema';
import { USERS } from '../../constants';

// Secure User List (Server-Side Only)
const SECURE_USERS = [
  { id: 'u1', name: 'Mahmoud', pin: '77337733w', role: 'USER' },
  { id: 'u2', name: 'Ismail', pin: '77002887p', role: 'USER' },
  { id: 'u3', name: 'Ayoub', pin: '00229900e', role: 'USER' },
  { id: 'nizar', name: 'Nizar', pin: '88994411n', role: 'USER' },
  { id: 'abdu', name: 'Abdu', pin: '11223344a', role: 'USER' },
];

// Populate Users if they don't exist (Seed)
async function ensureUsers() {
  for (const u of SECURE_USERS) {
    const exists = await User.findById(u.id);
    if (!exists) {
      await User.create({ _id: u.id, ...u, createdAt: new Date() });
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // 1. Database Connection with Timeout
    console.log("Connecting to DB...");
    await dbConnect();

    // 2. Extract Data
    const { action, payload, secret } = req.body;
    if (!action) return res.status(400).json({ error: 'Missing action' });

    console.log(`API Action: ${action}`);

    // 3. Security Check
    const adminActions = ['admin_stats', 'admin_reset', 'admin_reset_system', 'admin_get_answers', 'admin_export'];
    if (adminActions.includes(action)) {
      const envSecret = process.env.ADMIN_SECRET_KEY;
      const fallbackSecret = "bS%83B4+4uAO-#&&UyK;H+";
      if (secret !== envSecret && secret !== fallbackSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // 4. Seeding Check (Only on login or admin to save performance)
    if (action === 'login_user' || action === 'admin_stats') {
      await ensureUsers();
    }

    switch (action) {
      case 'login_user': {
        const { userId, pin } = payload;
        const user = await User.findById(userId);

        if (user && user.pin === pin) {
          const session = await Session.findOne({ userId });
          const hasProgress = !!(session && !session.isCompleted && (session.currentIndex > 0 || session.totalTimeSpent > 0));

          const userObj = user.toObject();
          delete userObj.pin;
          return res.json({ success: true, user: userObj, hasProgress });
        }
        return res.status(401).json({ error: 'Invalid PIN' });
      }

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

        // Atomic update of session progress and timer
        const updateObj: any = {
          currentIndex,
          lastActiveAt: Date.now()
        };

        // Increment time for the section
        const sectionField = `sectionTimes.${section}`;
        const incObj: any = { totalTimeSpent: timeSpent };
        if (section) incObj[sectionField] = timeSpent;

        await Session.findOneAndUpdate(
          { userId },
          { $set: updateObj, $inc: incObj },
          { upsert: true }
        );

        // Save or update answer
        await Answer.findOneAndUpdate(
          { userId, questionId },
          { section, answerText, $inc: { timeSpent }, updatedAt: Date.now() },
          { upsert: true }
        );

        return res.json({ success: true });
      }

      case 'log_event': {
        const { userId, event } = payload; // 'backtrack' or 'blur'
        const field = event === 'backtrack' ? 'backtrackCount' : 'blurCount';
        await Session.findOneAndUpdate({ userId }, { $inc: { [field]: 1 } });
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
        const users = await User.find({ role: 'USER' });
        const sessions = await Session.find({});
        const answers = await Answer.find({});

        const stats = users.map(u => {
          const s = sessions.find(sess => sess.userId === u.id) || null;
          const aCount = answers.filter(ans => ans.userId === u.id).length;
          const isOnline = s ? (Date.now() - s.lastActiveAt < 30000) : false;
          return { user: u, session: s, answerCount: aCount, isOnline };
        });

        return res.json(stats);
      }

      case 'admin_get_answers': {
        const { userId } = payload;
        const answers = await Answer.find({ userId }).sort({ questionId: 1 });
        return res.json(answers);
      }

      case 'admin_reset': {
        const { targetUserId } = payload;
        await Session.deleteOne({ userId: targetUserId });
        await Answer.deleteMany({ userId: targetUserId });
        await User.deleteOne({ _id: targetUserId });
        await Log.create({ userId: 'ADMIN', action: 'ADMIN_RESET', timestamp: Date.now(), metadata: { targetUserId } });
        return res.json({ success: true });
      }

      case 'admin_reset_system': {
        await Session.deleteMany({});
        await Answer.deleteMany({});
        await Log.deleteMany({});
        await User.deleteMany({ role: 'USER' });
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
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err: any) {
    console.error("CRITICAL API ERROR:", err);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}