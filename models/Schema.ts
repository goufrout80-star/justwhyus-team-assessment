import mongoose, { Schema, model, models, Model } from 'mongoose';

const UserSchema = new Schema({
  _id: { type: String, required: true }, // Manually set to match USERS constant IDs
  name: String,
  pin: String,
  role: String,
  language: String,
  createdAt: Date
});

const SessionSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  currentSection: { type: String, default: 'Mindset' },
  currentIndex: { type: Number, default: 0 },
  startedAt: { type: Number, default: Date.now },
  lastActiveAt: { type: Number, default: Date.now },
  totalTimeSpent: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  completedAt: Number
});

const AnswerSchema = new Schema({
  userId: { type: String, required: true },
  questionId: { type: Number, required: true },
  section: String,
  answerText: String,
  timeSpent: Number,
  updatedAt: { type: Number, default: Date.now }
});

// Composite index for quick lookups
AnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const LogSchema = new Schema({
  id: String,
  userId: String,
  action: String,
  timestamp: Number,
  metadata: Schema.Types.Mixed
});

// Helper to prevent strict type union errors in Next.js builds with Mongoose
// Casting to Model<any> ensures TS sees a single compatible signature
export const User = (models.User || model('User', UserSchema)) as Model<any>;
export const Session = (models.Session || model('Session', SessionSchema)) as Model<any>;
export const Answer = (models.Answer || model('Answer', AnswerSchema)) as Model<any>;
export const Log = (models.Log || model('Log', LogSchema)) as Model<any>;