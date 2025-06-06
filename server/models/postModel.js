import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
   name: { type: String, required: true },
   bio: { type: String, required: true },
   avatar: { type: String, required: true },
}, { _id: false });

const postSchema = new mongoose.Schema({
   title: { type: String, required: true },
   excerpt: { type: String, required: true },
   content: { type: String, required: true },
   image: { type: String },
   tags: [{ type: String }],
   category: { type: String },
   author: { type: authorSchema, required: true },
   readingTime: { type: String },
   date: { type: Date, default: Date.now },
   slug: { type: String, unique: true, required: true },
   views: { type: Number, default: 0 },
   likes: { type: Number, default: 0 },
   likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
   commentsCount: { type: Number, default: 0 },
}, {
   timestamps: true
});

const postModel = mongoose.models.post || mongoose.model('post', postSchema);

export default postModel;
