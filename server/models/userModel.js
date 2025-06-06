import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
   },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;