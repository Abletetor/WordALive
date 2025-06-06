import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authAdmin = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
   }

   const token = authHeader.split(' ')[1];
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.email !== process.env.ADMIN_EMAIL) {
         return res.status(403).json({ success: false, message: "Not authorized" });
      }

      req.admin = decoded;
      return next();
   } catch (error) {
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ success: false, message: "Token expired" });
      }

      return res.status(401).json({ success: false, message: "Invalid or malformed token" });
   }
};


export default authAdmin;
