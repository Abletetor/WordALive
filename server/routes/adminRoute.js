import express from 'express';
import { deleteComment, getAllComments, getDashboardOverview, getPostAnalytics, loginAdmin } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';
const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get("/dashboard/summary", authAdmin, getDashboardOverview);
adminRouter.get("/dashboard/analytics", authAdmin, getPostAnalytics);
adminRouter.get("/dashboard/comments", authAdmin, getAllComments);
adminRouter.delete("/dashboard/comments/:id", authAdmin, deleteComment);

export default adminRouter;