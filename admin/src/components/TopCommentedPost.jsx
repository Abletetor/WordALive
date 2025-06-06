import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const TopCommentedPosts = ({ posts }) => {
   return (
      <motion.div
         className="bg-[#1e1e2f] rounded-2xl shadow p-5"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.5 } }
      >
         <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageCircle size={ 20 } className="text-green-400" />
            Top 5 Commented Posts
         </h3>

         <ul className="space-y-3">
            { posts.map((post, i) => (
               <li
                  key={ post.slug }
                  className="text-sm bg-[#2a2a3d] p-3 rounded-xl flex justify-between items-center"
               >
                  <span className="text-gray-300 truncate max-w-[70%]">
                     { i + 1 }. { post.title }
                  </span>
                  <span className="text-green-400 font-semibold">
                     { post.commentsCount } comments
                  </span>
               </li>
            )) }
         </ul>
      </motion.div>
   );
};

export default TopCommentedPosts;
