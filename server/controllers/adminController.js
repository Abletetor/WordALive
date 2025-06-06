import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import postModel from '../models/postModel.js';
import commentModel from '../models/commentModel.js';
import userModel from '../models/userModel.js';

dotenv.config();

// ** Login Admin
export const loginAdmin = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validate fields
      if (!email || !password) {
         return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // Check if admin credentials are correct
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
         return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      // Generate JWT token
      const token = jwt.sign({ email },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN });

      // Send response
      return res.status(200).json({
         success: true,
         message: "Logged in successfully",
         token
      });

   } catch (error) {
      console.log("Error in admin login: ", error);
      return res.status(500).json({ success: false, message: "Server error" });
   }
};

// ** Get Dashboard Overview
export const getDashboardOverview = async (req, res) => {

   try {
      const [totalPosts, totalComments, totalUsers] = await Promise.all([
         postModel.countDocuments(),
         commentModel.countDocuments(),
         userModel.countDocuments()
      ]);

      // Extract unique category count
      const categories = await postModel.distinct("category");
      const totalCategories = categories.length;

      // Prepare response data
      const overviewData = {
         totalPosts,
         totalComments,
         totalUsers,
         totalCategories
      };

      res.status(200).json({
         success: true,
         overviewData,
         message: "Dashboard overview fetched successfully"
      });
   } catch (error) {
      console.log("Error in getting dashboard overview: ", error);
      return res.status(500).json({ success: false, message: "Server error" });
   }
};

// **Get Post Analytics
export const getPostAnalytics = async (req, res) => {
   try {
      const range = parseInt(req.query.range) || 7;
      const dateThreshold = new Date(Date.now() - range * 24 * 60 * 60 * 1000);

      // Views over time (bar/line chart)
      const viewsOverTime = await postModel.aggregate([
         { $match: { createdAt: { $gte: dateThreshold } } },
         {
            $group: {
               _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
               totalViews: { $sum: "$views" }
            }
         },
         { $sort: { _id: 1 } }
      ]);

      // Top 5 most viewed posts
      const topViewedPosts = await postModel.find({})
         .sort({ views: -1 })
         .limit(5)
         .select("title views slug");

      // Top 5 most commented posts (using commentsCount field)
      const topCommentedPosts = await postModel.find({})
         .sort({ commentsCount: -1 })
         .limit(5)
         .select("title commentsCount slug");

      // Prepare response data
      const analyticsData = {
         viewsOverTime,
         topViewedPosts,
         topCommentedPosts
      };
      res.status(200).json({
         success: true,
         analyticsData,
         message: "Post analytics fetched successfully"
      });
   } catch (error) {
      console.log("Error in getting post analytics: ", error);
      return res.status(500).json({ success: false, message: "Server error" });
   }
};

// ** Get All Comments
export const getAllComments = async (req, res) => {
   try {
      const comments = await commentModel.find({})
         .populate("post", "title slug")
         .populate("user", "name email avatar")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         comments,
         message: "All comments fetched successfully"
      });
   } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

// ** Delete Comment
export const deleteComment = async (req, res) => {
   try {
      const { id } = req.params;
      const comment = await commentModel.findByIdAndDelete(id);
      if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

      res.status(200).json({ success: true, message: "Comment deleted successfully" });
   } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

