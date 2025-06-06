import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import postRouter from './routes/postRoute.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import commentRouter from './routes/commentRoute.js';

dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [process.env.USER_FRONTEND_URL, process.env.ADMIN_FRONTEND_URL];

const corsOptions = {
   origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   credentials: true,
   allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());


// API ENDPOINTS
app.use('/api/posts', postRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/comments', commentRouter);

app.listen(port, () => {
   console.log(`Server Listening on ${port}`);
});