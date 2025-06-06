import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import PostCard from "./PostCard";
import CategoryRow from "./CategoryRow";
import { AppContext } from "../context/AppContext";

const RecentPosts = () => {
   const { getAllPosts, pagination, posts, loading } = useContext(AppContext);
   const [currentPage, setCurrentPage] = useState(1);
   const [activeCategory, setActiveCategory] = useState("All");

   useEffect(() => {
      getAllPosts(currentPage);
   }, [currentPage]);

   const filteredPosts =
      activeCategory === "All"
         ? posts
         : posts.filter((post) => post.tags.includes(activeCategory));

   const handleCategoryChange = (category) => {
      setActiveCategory(category);
      setCurrentPage(1);
   };

   const handlePageChange = (direction) => {
      if (direction === "prev" && currentPage > 1) {
         setCurrentPage((prev) => prev - 1);
      } else if (direction === "next" && currentPage < pagination.totalPages) {
         setCurrentPage((prev) => prev + 1);
      }
   };

   return (
      <section className="bg-zinc-950 pt-10" id="recent-posts">
         <motion.div
            initial={ { opacity: 0, y: 30 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6 } }
            className="container mx-auto min-h-screen p-6"
         >
            <motion.h2
               initial={ { opacity: 0, y: 10 } }
               animate={ { opacity: 1, y: 0 } }
               transition={ { delay: 0.2 } }
               className="text-3xl font-bold text-purple-400 mb-10 text-center"
            >
               Recent Posts
            </motion.h2>

            <div className="flex justify-center items-center mb-10">
               <CategoryRow
                  activeCategory={ activeCategory }
                  setActiveCategory={ handleCategoryChange }
               />
            </div>

            { loading ? (
               <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin w-8 h-8 text-gray-400" />
               </div>
            ) : (
               <motion.div
                  layout
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
               >
                  <AnimatePresence>
                     { filteredPosts.map((post) => (
                        <motion.div
                           key={ post._id }
                           initial={ { opacity: 0, y: 20 } }
                           animate={ { opacity: 1, y: 0 } }
                           exit={ { opacity: 0, y: -20 } }
                           transition={ { duration: 0.4 } }
                        >
                           <PostCard post={ post } />
                        </motion.div>
                     )) }
                  </AnimatePresence>
               </motion.div>
            ) }

            { pagination.totalPages > 1 && (
               <motion.div
                  initial={ { opacity: 0, y: 10 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { delay: 0.4 } }
                  className="flex justify-center items-center gap-3 mt-14"
               >
                  <button
                     onClick={ () => handlePageChange("prev") }
                     disabled={ currentPage === 1 }
                     className={ `p-2 rounded-full transition ${currentPage === 1
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        }` }
                  >
                     <ArrowLeft size={ 16 } />
                  </button>

                  <span className="text-zinc-400 text-sm">
                     Page { currentPage } of { pagination.totalPages }
                  </span>

                  <button
                     onClick={ () => handlePageChange("next") }
                     disabled={ currentPage === pagination.totalPages }
                     className={ `p-2 rounded-full transition ${currentPage === pagination.totalPages
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        }` }
                  >
                     <ArrowRight size={ 16 } />
                  </button>
               </motion.div>
            ) }
         </motion.div>
      </section>
   );
};

export default RecentPosts;
