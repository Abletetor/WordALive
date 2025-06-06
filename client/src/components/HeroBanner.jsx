import { motion } from "framer-motion";
import FeaturedPostCard from "./FeaturedPostCard";

const HeroBanner = () => {
   return (
      <section className="bg-zinc-950 text-zinc-100 py-20 px-6 md:px-12">
         <div className="max-w-5xl mx-auto text-center">
            <motion.h1
               initial={ { opacity: 0, y: -20 } }
               animate={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.6 } }
               className="text-4xl md:text-5xl font-extrabold text-purple-400 tracking-tight italic"
            >
               Truth Illuminated Through Scripture
            </motion.h1>

            <motion.p
               initial={ { opacity: 0, y: 10 } }
               animate={ { opacity: 1, y: 0 } }
               transition={ { delay: 0.2, duration: 0.5 } }
               className="mt-4 text-lg text-zinc-400"
            >
               Explore soul-stirring devotionals, timeless biblical truths, and Christ-centered insights that ignite faith and transform lives.
            </motion.p>

            <motion.div
               initial={ { opacity: 0, y: 10 } }
               animate={ { opacity: 1, y: 0 } }
               transition={ { delay: 0.4, duration: 0.5 } }
               className="mt-8"
            >
               <a
                  className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl shadow transition"
                  href="#recent-posts"
               >
                  Explore Posts
               </a>
            </motion.div>
         </div>

         {/* Featured Post Below Tagline */ }
         <FeaturedPostCard />
      </section>
   );
};

export default HeroBanner;
