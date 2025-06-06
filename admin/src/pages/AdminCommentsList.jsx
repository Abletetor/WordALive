import { useEffect, useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { Trash2, Loader } from "lucide-react";
import { motion } from "framer-motion";

const AdminCommentsList = () => {
   const { adminToken, backendUrl, axiosAuth } = useContext(AdminContext);
   const [comments, setComments] = useState([]);
   const [loading, setLoading] = useState(true);

   const headers = { headers: { Authorization: `Bearer ${adminToken}` } };

   const fetchComments = async () => {
      try {
         const res = await axiosAuth.get(`${backendUrl}/api/admin/dashboard/comments`, headers);
         setComments(res.data.comments);
      } catch (err) {
         toast.error(err.response?.data?.message || "Failed to fetch comments");
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this comment?")) return;
      try {
         await axiosAuth.delete(`${backendUrl}/api/admin/dashboard/comments/${id}`, headers);
         setComments((prev) => prev.filter(c => c._id !== id));
         toast.success("Comment deleted");
      } catch (err) {
         toast.error(err.response?.data?.message || "Failed to delete comment");
      }
   };

   useEffect(() => {
      fetchComments();
   }, []);

   if (loading) return <div className="bg-zinc-950 min-h-screen flex justify-center items-center">
      <Loader className="text-blue-400 w-10 h-10 animate-spin" />
   </div>;

   return (
      <section className="bg-[#121212]">
         <div className="container mx-auto p-6 min-h-screen">
            <div className="mb-4">
               <h2 className="text-2xl font-bold text-white">🗨️ Comments Management</h2>
               <p className="text-sm text-gray-400">Manage and moderate all user comments here</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
               { comments.length === 0 ? (
                  <div className="text-gray-400 text-center py-10">No comments found</div>
               ) : (
                  comments.map((comment) => (
                     <motion.div
                        key={ comment._id }
                        initial={ { opacity: 0, y: 10 } }
                        animate={ { opacity: 1, y: 0 } }
                        exit={ { opacity: 0, y: -10 } }
                        transition={ { duration: 0.3 } }
                        className="bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-md hover:shadow-lg transition"
                     >
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-gray-200 text-sm">{ comment.content }</p>
                              <div className="text-xs text-gray-500">
                                 <span>On <strong>{ comment.post?.title }</strong></span> &middot;{ " " }
                                 <span>By <strong>{ comment.user?.name || "Unknown" }</strong></span> &middot;{ " " }
                                 <span>{ new Date(comment.createdAt).toLocaleString() }</span>
                              </div>
                           </div>
                           <button
                              onClick={ () => handleDelete(comment._id) }
                              className="text-red-500 hover:text-red-600 transition"
                              title="Delete comment"
                           >
                              <Trash2 size={ 18 } />
                           </button>
                        </div>
                     </motion.div>
                  ))
               ) }
            </div>
         </div>
      </section>
   );
};

export default AdminCommentsList;
