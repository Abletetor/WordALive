import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
   post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: true
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
   },
   content: {
      type: String,
      required: true,
      trim: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
}, { timestamps: true });

const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema);

export default commentModel;