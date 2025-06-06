import postModel from "../models/postModel.js";
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// **Register User
export const registerUser = async (req, res) => {
   const { email, name, password } = req.body;

   try {
      if (!email || !name || !password) {
         return res.status(400).json({ success: false, message: "All fields are required" });
      }
      if (password.length < 8) {
         return res.status(400).json({ success: false, message: "Enter a strong password (8+ characters)" });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({ name, email, password: hashedPassword });

      // Token Generation
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
         success: true,
         message: "User registered successfully",
         token,
         user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
         }
      });
   } catch (error) {
      console.error("Error in user registration:", error);
      res.status(500).json({ success: false, message: "Server error during registration" });
   }
};

// ** Login User **
export const loginUser = async (req, res) => {
   const { email, password } = req.body;

   try {
      if (!email || !password) {
         return res.status(400).json({ success: false, message: "Email and password are required" });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      //Generate Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(200).json({
         success: true,
         message: "User logged in successfully",
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
         }
      });

   } catch (error) {
      console.log("Error in user login:", error);
      res.status(500).json({ success: false, message: "Server error during login" });
   }
};

// ** Get Single Post
export const getSinglePost = async (req, res) => {
   try {
      const slug = req.params.slug;
      // Find the post
      const post = await postModel.findOne({ slug });

      if (!post) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }

      // Increment views (asynchronously)
      postModel.updateOne({ slug }, { $inc: { views: 1 } }).exec();

      res.status(200).json({
         success: true,
         post,
         liked: post.likedBy.includes(req.user?._id)
      });
   } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};
