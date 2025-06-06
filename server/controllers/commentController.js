import commentModel from '../models/commentModel.js';
import postModel from '../models/postModel.js';

// ** Add Comment
export const addComment = async (req, res) => {

   try {
      const { slug } = req.params;
      const { text } = req.body;

      if (!text) {
         return res.status(400).json({ success: false, message: "Comment text is required" });
      }

      const post = await postModel.findOne({ slug });
      if (!post) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }

      const comment = await commentModel.create({
         post: post._id,
         user: req.user.id,
         content: text,
      });

      post.commentsCount += 1;
      await post.save();

      res.status(201).json({
         success: true,
         message: "Comment added successfully",
         comment
      });
   } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ success: false, message: "Server error while adding comment" });
   }
};

// ** Get Comments By Post
export const getCommentsByPost = async (req, res) => {
   try {
      const { slug } = req.params;

      const post = await postModel.findOne({ slug });
      if (!post) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }

      const comments = await commentModel.find({ post: post._id })
         .populate('user', 'name avatar')
         .sort({ createdAt: -1 });

      res.status(200).json({ success: true, comments });
   } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ success: false, message: "Server error while fetching comments" });
   }
};

// ** Delete Comment
export const deleteComment = async (req, res) => {
   try {
      const commentId = req.params;

      const comment = await commentModel.findById(commentId);
      if (!comment) {
         return res.status(404).json({ success: false, message: "Comment not found" });
      }

      if (comment.user.toString() !== req.user._id.toString()) {
         return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
      }

      await commentModel.findByIdAndDelete(commentId);
      await postModel.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

      res.status(200).json({ success: true, message: "Comment deleted successfully" });
   } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ success: false, message: "Server error while deleting comment" });
   }
};

// ** Update Comment
export const updateComment = async (req, res) => {
   try {
      const { text } = req.body;
      const commentId = req.params.id;

      if (!text || !text.trim()) {
         return res.status(400).json({ success: false, message: "Comment text is required" });
      }

      const comment = await commentModel.findById(commentId);
      if (!comment) {
         return res.status(404).json({ success: false, message: "Comment not found" });
      }

      // Make sure the logged-in user is the owner
      if (comment.user.toString() !== req.user.id) {
         return res.status(403).json({ success: false, message: "Unauthorized to edit this comment" });
      }

      comment.content = text.trim();
      await comment.save();

      res.status(200).json({
         success: true,
         message: "Comment updated successfully",
         comment,
      });
   } catch (error) {
      console.log("Error updating comment:", error);
      res.status(500).json({ success: false, message: "Server error while updating comment" });
   }
};