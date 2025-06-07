import express from 'express';
import { createPost, deletePost, getAllPosts, getSinglePost, toggleLike, updatePost, searchPosts } from '../controllers/postController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { authUser } from '../middlewares/authUser.js';
const postRouter = express.Router();

postRouter.post('/create',
   authAdmin,
   upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'authorAvatar', maxCount: 1 }
   ]), createPost);

postRouter.get('/search', searchPosts);
postRouter.get('/all', authAdmin, getAllPosts);
postRouter.get('/:id', authAdmin, getSinglePost);
postRouter.delete('/delete/:id', authAdmin, deletePost);
postRouter.put('/edit/:id',
   authAdmin,
   upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'authorAvatar', maxCount: 1 }
   ]), updatePost);

postRouter.post('/like/:slug', authUser, toggleLike);


export default postRouter;