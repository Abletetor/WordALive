import { motion } from "framer-motion";
import { Users, Lightbulb, BookOpen, Mail } from "lucide-react";

const About = () => {
   return (
      <section className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-20 flex flex-col items-center justify-start">
         {/* Heading */ }
         <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6 } }
            className="max-w-3xl text-center mb-14"
         >
            <h1 className="text-4xl font-bold mb-4">About WordALive</h1>
            <p className="text-zinc-400 text-lg">
               A Christ-centered space sharing Spirit-led devotionals, scriptural insights, and faith-building truths to strengthen believers daily.
            </p>
         </motion.div>

         {/* Sections */ }
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {/* Mission */ }
            <motion.div
               initial={ { opacity: 0, y: 30 } }
               whileInView={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.5 } }
               className="bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-800"
            >
               <Lightbulb size={ 28 } className="text-yellow-400 mb-4" />
               <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
               <p className="text-sm text-zinc-400">
                  To reveal God’s Word through Spirit-inspired devotionals that ignite faith, inspire purpose, and guide hearts in truth.
               </p>
            </motion.div>

            {/* Focus */ }
            <motion.div
               initial={ { opacity: 0, y: 30 } }
               whileInView={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.6, delay: 0.1 } }
               className="bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-800"
            >
               <BookOpen size={ 28 } className="text-green-400 mb-4" />
               <h3 className="text-xl font-semibold mb-2">What We Share</h3>
               <p className="text-sm text-zinc-400">
                  Daily devotionals, scripture studies, spiritual growth guides, and reflections on living a victorious life in Christ Jesus.
               </p>
            </motion.div>

            {/* Community */ }
            <motion.div
               initial={ { opacity: 0, y: 30 } }
               whileInView={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.6, delay: 0.2 } }
               className="bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-800"
            >
               <Users size={ 28 } className="text-purple-400 mb-4" />
               <h3 className="text-xl font-semibold mb-2">Built for Believers</h3>
               <p className="text-sm text-zinc-400">
                  Whether you’re new to the faith or deeply rooted in the Word, this space is for believers who desire to grow daily and walk in divine purpose.
               </p>
            </motion.div>
         </div>

         {/* CTA */ }
         <motion.div
            initial={ { opacity: 0, scale: 0.95 } }
            whileInView={ { opacity: 1, scale: 1 } }
            transition={ { duration: 0.5, delay: 0.3 } }
            className="mt-16 text-center"
         >
            <h2 className="text-2xl font-bold mb-3">Want to reach out or share a testimony?</h2>
            <p className="text-zinc-400 mb-4">
               We’d love to connect with you. Reach out and let’s build faith together.
            </p>
            <a
               href="mailto:youremail@example.com"
               className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-full text-white font-medium"
            >
               <Mail size={ 18 } />
               Contact Me
            </a>
         </motion.div>
      </section>
   );
};

export default About;
