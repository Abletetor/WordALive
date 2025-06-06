import { useContext } from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { AppContext } from "../context/AppContext";

const defaultCategories = [
   "Healing",
   "Health",
   "Prosperity",
   "Growth",
   "Salvation",
   "Faith",
   "Wisdom"
];

const CategoryRow = ({ activeCategory, setActiveCategory }) => {
   const { posts } = useContext(AppContext);

   // Extract all unique tags from posts
   const contextCategories = Array.from(
      new Set(posts.flatMap((post) => post.tags))
   );

   const categories = ["All", ...(contextCategories.length ? contextCategories : defaultCategories)];

   return (
      <motion.div
         initial={ { y: -10, opacity: 0 } }
         animate={ { y: 0, opacity: 1 } }
         transition={ { duration: 0.5 } }
         className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-10"
      >
         <div className="flex items-center gap-2 text-zinc-300 text-sm">
            <Tag size={ 18 } className="text-purple-400" />
            <span className="font-semibold">Filter:</span>
         </div>

         { categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
               <motion.button
                  key={ cat }
                  whileTap={ { scale: 0.95 } }
                  whileHover={ { scale: 1.05 } }
                  onClick={ () => setActiveCategory(cat) }
                  className={ `px-4 py-1.5 rounded-full text-sm font-medium transition ${isActive
                     ? "bg-purple-500 text-white"
                     : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                     }` }
               >
                  { cat }
               </motion.button>
            );
         }) }
      </motion.div>
   );
};

export default CategoryRow;
