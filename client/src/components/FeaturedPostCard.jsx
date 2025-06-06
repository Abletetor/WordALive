import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useContext, useMemo } from "react";

const FeaturedPostCard = () => {
   const { posts } = useContext(AppContext);

   // Sort posts by date descending (newest first)
   const featured = useMemo(() => {
      if (!posts || posts.length === 0) return null;
      const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
      return sorted[0]; // latest post
   }, [posts]);

   if (!featured) return null; // or a fallback UI

   return (
      <motion.div
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { delay: 0.6, duration: 0.6 } }
         className="bg-zinc-800 rounded-xl overflow-hidden shadow-md mt-12 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-300"
         id="#recent-posts"
      >
         <img
            src={ featured.image }
            alt={ featured.title }
            className="w-full h-64 object-cover"
         />

         <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400">
               <div className="flex gap-2 flex-wrap">
                  { featured.tags?.map((tag, index) => (
                     <span
                        key={ index }
                        className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-zinc-700 text-zinc-300 hover:bg-blue-600 hover:text-white transition"
                     >
                        <Tag size={ 12 } />
                        { tag }
                     </span>
                  )) }
               </div>
               <span className="flex items-center gap-1">
                  <Clock size={ 14 } />
                  { featured.readingTime }
               </span>
            </div>

            <h2 className="text-2xl font-bold text-zinc-100 leading-tight">
               { featured.title }
            </h2>

            <p className="text-zinc-400 text-sm">{ featured.excerpt }</p>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
               <span className="text-sm text-blue-400">By { featured.author?.name }</span>
               <Link
                  to={ `/posts/${featured.slug}` }
                  className="text-sm text-blue-400 hover:underline"
                  onClick={ () => scrollTo(0, 0) }
               >
                  Read More →
               </Link>
            </div>
         </div>
      </motion.div>
   );
};

export default FeaturedPostCard;
