import { HeartHandshake, Mail, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SalvationPage = () => {
   return (
      <section className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-zinc-100 px-6 py-16 flex items-center justify-center">
         <motion.div
            initial={ { opacity: 0, y: 40 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.8, ease: 'easeOut' } }
            className="bg-zinc-950 rounded-2xl shadow-lg max-w-3xl w-full px-6 sm:px-8 py-10 text-center"
         >
            <div className="flex justify-center mb-6">
               <HeartHandshake className="text-purple-500 w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-purple-400 mb-4">
               Welcome to New Life in Christ!
            </h1>
            <p className="text-zinc-300 text-lg leading-relaxed mb-6">
               If you’re ready to surrender your life to Jesus and begin a personal relationship with Him,
               you can pray this prayer with faith from your heart:
            </p>

            <blockquote className="bg-zinc-800 p-6 rounded-xl border border-purple-400 text-left text-zinc-100 italic mb-6">
               <p>
                  "O Lord God, I believe with all my heart in Jesus Christ, Son of the living God.
                  I believe He died for me and God raised Him from the dead. I believe He’s alive today.
                  I confess with my mouth that Jesus Christ is the Lord of my life from this day.
                  Through Him and in His Name, I have eternal life; I’m born again. Thank you Lord,
                  for saving my soul! I’m now a child of God. Hallelujah!"
               </p>
            </blockquote>

            <p className="text-green-400 font-medium mb-6">
               🎉 Congratulations! You are now a child of God.
            </p>

            {/* 📘 Downloadable Book Section */ }
            <div className="bg-zinc-800 p-6 rounded-xl mb-8 text-left">
               <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="text-yellow-400 w-6 h-6" />
                  <h3 className="text-lg font-semibold text-yellow-400">
                     Free Book: Now That You Are Born Again
                  </h3>
               </div>
               <p className="text-zinc-300 mb-4">
                  This short book will guide you in your new walk with Christ. It’s simple, powerful, and life-transforming.
               </p>
               <a
                  href="/born_again.pdf"
                  download
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-5 rounded-full transition text-sm sm:text-base"
               >
                  📥 Download Now
               </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
               <Link
                  to="/"
                  onClick={ () => scrollTo(0, 0) }
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full font-medium transition text-center"
               >
                  Go Back Home
               </Link>
               <a
                  href="mailto:youremail@example.com"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-full text-white font-medium text-center"
               >
                  <Mail size={ 18 } />
                  Send Us a Message
               </a>
            </div>
         </motion.div>
      </section>
   );
};

export default SalvationPage;
