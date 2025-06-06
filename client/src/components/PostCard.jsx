import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";

const PostCard = ({ post }) => {
   return (
      <motion.div
         whileHover={ { y: -4 } }
         transition={ { type: "spring", stiffness: 200 } }
         className="bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-purple-500/20 transition-shadow duration-300"
      >
         {/* Thumbnail */ }
         <Link to={ `/posts/${post.slug}` }
            onClick={ () => scrollTo(0, 0) }>
            <img
               src={ post.image }
               alt={ post.title }
               className="w-full h-48 object-cover"
            />
         </Link>

         {/* Content */ }
         <div className="p-5 flex flex-col gap-3">
            {/* Tags */ }
            <div className="flex gap-2 flex-wrap">
               { post.tags.map((tag, idx) => (
                  <span
                     key={ idx }
                     className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-zinc-700 text-zinc-300 hover:bg-blue-600 hover:text-white transition"
                  >
                     <Tag size={ 12 } />
                     { tag }
                  </span>
               )) }
            </div>

            {/* Title */ }
            <Link to={ `/posts/${post.slug}` }
               onClick={ () => scrollTo(0, 0) }>
               <h3 className="text-lg font-semibold text-zinc-100 hover:text-blue-400 transition">
                  { post.title }
               </h3>
            </Link>

            {/* Excerpt */ }
            <p className="text-sm text-zinc-400 line-clamp-3">
               { post.excerpt }
            </p>

            {/* Meta Info */ }
            <div className="flex justify-between items-center text-xs text-zinc-400 mt-2">
               <span className="italic text-blue-400">By { post.author.name }</span>
               <span className="flex items-center gap-1 text-blue-400">
                  <Clock size={ 14 } />
                  { post.readingTime }
               </span>
            </div>
         </div>
      </motion.div>
   );
};

export default PostCard;
