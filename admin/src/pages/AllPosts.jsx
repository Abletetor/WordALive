import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, MessageSquare, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AllPosts = () => {
   const { backendUrl, adminToken, axiosAuth, getAllPosts, pagination, posts, setPosts, loading } = useContext(AdminContext);
   const navigate = useNavigate();

   useEffect(() => {
      getAllPosts();
   }, []);

   const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= pagination.totalPages) {
         getAllPosts(newPage);
      }
   };

   const handleEdit = (post) => {
      navigate(`/admin/edit/${post._id}`);
   };

   const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      try {
         const { data } = await axiosAuth.delete(`${backendUrl}/api/posts/delete/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });

         if (data.success) {
            toast.success("Post deleted successfully");
            setPosts(prev => prev.filter(p => p._id !== id));
         } else {
            toast.error(data.message);
         }
      } catch (err) {
         toast.error(err.response?.data?.message || "Failed to delete post");
      }
   };

   return (
      <section className="bg-[#0f0f0f]">
         <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.5 } }
            className="container mx-auto min-h-screen p-6 text-gray-200"
         >
            <h1 className="text-3xl font-bold mb-8">All Blog Posts</h1>

            { loading ? (
               <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin w-8 h-8 text-gray-400" />
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  { posts.map((post) => (
                     <motion.div
                        key={ post._id }
                        whileHover={ { scale: 1.02 } }
                        className="bg-[#1a1a1a] rounded-2xl shadow-lg p-5 border border-gray-700 hover:border-indigo-500 transition-all flex flex-col justify-between"
                     >
                        <div>
                           <h2 className="text-xl font-semibold mb-2 text-indigo-400">{ post.title }</h2>
                           <p className="text-sm text-gray-400 mb-2 line-clamp-2">{ post.excerpt }</p>
                           <p className="text-xs text-gray-500 mb-4">{ post.category } | { post.readingTime }</p>

                           <div className="flex items-center mb-4">
                              <img
                                 src={ post.author?.avatar }
                                 alt="avatar"
                                 className="w-10 h-10 rounded-full object-cover border border-gray-600"
                              />
                              <div className="ml-3">
                                 <p className="text-sm font-medium">{ post.author.name }</p>
                                 <p className="text-xs text-gray-400">{ post.author.bio }</p>
                              </div>
                           </div>
                        </div>

                        {/* Footer actions */ }
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                           {/* Stats */ }
                           <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                 <Eye className="w-4 h-4" />
                                 <span>{ post.views || 0 }</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <MessageSquare className="w-4 h-4" />
                                 <span>{ post.comments?.length || 0 }</span>
                              </div>
                           </div>

                           {/* Actions */ }
                           <div className="flex items-center gap-3">
                              <button
                                 onClick={ () => handleEdit(post) }
                                 className="hover:text-indigo-400 transition cursor-pointer"
                                 title="Edit Post"
                              >
                                 <Edit className="w-5 h-5" />
                              </button>
                              <button
                                 onClick={ () => handleDelete(post._id) }
                                 className="hover:text-red-500 transition cursor-pointer"
                                 title="Delete Post"
                              >
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                     </motion.div>

                  )) }
               </div>
            ) }

            {/* Pagination Controls */ }
            <div className="flex justify-center items-center gap-4 mt-10">
               <button
                  onClick={ () => handlePageChange(pagination.page - 1) }
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-white flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  disabled={ pagination.page <= 1 }
               >
                  <ChevronLeft className="w-4 h-4" /> Prev
               </button>

               <span className="text-gray-300 text-sm">
                  Page { pagination.page } of { pagination.totalPages }
               </span>

               <button
                  onClick={ () => handlePageChange(pagination.page + 1) }
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-white flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  disabled={ pagination.page >= pagination.totalPages }
               >
                  Next <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </motion.div>
      </section>
   );
};

export default AllPosts; 
