import express from 'express';
import { getAllPosts } from '../controllers/postController.js';
import { getSinglePost, loginUser, registerUser } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/all-post', getAllPosts);
userRouter.get('/view/:slug', getSinglePost);

export default userRouter;