import express from 'express';
import { addComment, deleteComment, getCommentsByPost, updateComment } from '../controllers/commentController.js';
import { authUser } from '../middlewares/authUser.js';

const commentRouter = express.Router();

commentRouter.post('/:slug', authUser, addComment);
commentRouter.get('/:slug', getCommentsByPost);
commentRouter.delete('/:id', authUser, deleteComment);
commentRouter.put('/:id', authUser, updateComment);



export default commentRouter;
