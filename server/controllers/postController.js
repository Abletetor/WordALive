import postModel from '../models/postModel.js';
import slugify from 'slugify';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// ** Create Post **
const createPost = async (req, res) => {
   try {
      const {
         title, excerpt, content,
         tags, category, readingTime,
         authorName, authorBio
      } = req.body;

      // Validate fields
      if (!title || !excerpt || !content || !category || !readingTime || !authorName || !authorBio) {
         return res.status(400).json({ success: false, message: "All fields are required" });
      }

      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

      // Prepare new post data
      const newPost = new postModel({
         title, excerpt, content,
         tags: tagsArray,
         category, readingTime,
         image: req.files?.image?.[0]?.path || '',
         author: {
            name: authorName,
            bio: authorBio,
            avatar: req.files?.authorAvatar?.[0]?.path || ''
         },
         slug: slugify(title, { lower: true, strict: true }),
      });

      const savedPost = await newPost.save();
      res.status(201).json({ success: true, message: "Post created successfully", savedPost });

   } catch (error) {
      console.log("Error In Create Post: ", error);
      res.status(500).json({ success: false, message: "Server error while creating post" });
   }
};

// ** All Posts **
const getAllPosts = async (req, res) => {

   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [posts, totalPosts] = await Promise.all([
         postModel.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'name bio avatar'),
         postModel.countDocuments()
      ]);

      res.status(200).json({
         success: true,
         posts,
         pagination: {
            total: totalPosts,
            page,
            limit,
            totalPages: Math.ceil(totalPosts / limit)
         }
      });
   } catch (error) {
      console.log("Error In Get All Posts: ", error);
      res.status(500).json({ success: false, message: "Server error while fetching posts" });
   }
};

// ** Get Single Post  For Admin**
const getSinglePost = async (req, res) => {
   try {
      const { id } = req.params;

      const post = await postModel.findById(id).populate('author', 'name bio avatar');
      if (!post) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.status(200).json({ success: true, post });
   } catch (error) {
      console.error("Error In Get Single Post:", error);
      res.status(500).json({ success: false, message: "Server error while fetching post" });
   }
};

// ** Delete Post **
const deletePost = async (req, res) => {
   try {
      const postId = req.params.id;
      const deleted = await postModel.findByIdAndDelete(postId);
      if (!deleted) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }
      res.status(200).json({ success: true, message: "Post deleted successfully" });
   } catch (error) {
      console.log("Error In Delete Post: ", error);
      res.status(500).json({ success: false, message: "Server error while deleting post" });
   }
};

// ** Update Post ** 
const updatePost = async (req, res) => {
   try {
      const { id } = req.params;
      const {
         title, excerpt, content, tags, category,
         readingTime, authorName, authorBio
      } = req.body;

      const post = await postModel.findById(id);
      if (!post) return res.status(404).json({ success: false, message: "Post not found" });

      // Update image if new one is provided
      if (req.files?.image) {
         const uploadedImage = await cloudinary.uploader.upload(req.files.image[0].path, {
            folder: "blog_post"
         });
         post.image = uploadedImage.secure_url;
         await fs.unlink(req.files.image[0].path);
      }

      // Update author avatar if provided
      if (req.files?.authorAvatar) {
         const uploadedAvatar = await cloudinary.uploader.upload(req.files.authorAvatar[0].path, {
            folder: "blog_post"
         });
         post.author.avatar = uploadedAvatar.secure_url;
         await fs.unlink(req.files.authorAvatar[0].path);
      }

      // Update other fields
      post.title = title;
      post.excerpt = excerpt;
      post.content = content;
      post.tags = tags;
      post.category = category;
      post.readingTime = readingTime;
      post.author.name = authorName;
      post.author.bio = authorBio;

      await post.save();

      res.status(200).json({ success: true, message: "Post updated successfully", post });

   } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ success: false, message: "Server error while updating post" });
   }
};

// ** Views Increment **
const incrementPostViews = async (req, res) => {
   const { slug } = req.params;

   try {
      await postModel.findByIdAndUpdate(
         { slug },
         {
            $inc: { views: 1 }
         });
      res.status(200).json({ success: true, message: "Post views incremented" });
   } catch (error) {
      console.error("Error incrementing post views:", error);
      res.status(500).json({ success: false, message: "Server error while incrementing views" });
   }
};

// ** Like Post
const toggleLike = async (req, res) => {
   const slug = req.params.slug;
   const userId = req.user._id;

   try {
      const post = await postModel.findOne({ slug });
      if (!post) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }

      const alreadyLiked = post.likedBy.includes(userId);

      if (alreadyLiked) {
         post.likedBy.pull(userId);
      } else {
         post.likedBy.push(userId);
      }

      post.likes = post.likedBy.length;
      await post.save();

      res.status(200).json({
         success: true,
         likes: post.likes,
         liked: !alreadyLiked,
      });
   } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ success: false, message: "Server error while toggling like" });
   }
};

export {
   createPost, getAllPosts, getSinglePost,
   deletePost, updatePost, incrementPostViews,
   toggleLike,
};