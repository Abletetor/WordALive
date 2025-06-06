import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Loader, AlertCircle, BookOpenText, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCAL_STORAGE_KEY = 'featuredVerse';

const getTodayDateKey = () => {
   const today = new Date();
   return today.toISOString().split('T')[0];
};

const FeaturedScripture = () => {
   const [verse, setVerse] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [todayKey, setTodayKey] = useState(getTodayDateKey());

   const loadVerse = async (forceRefresh = false) => {
      try {
         setLoading(true);
         const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
         const currentDate = getTodayDateKey();

         if (!forceRefresh && cached) {
            const { date, data } = JSON.parse(cached);
            if (date === currentDate) {
               setVerse(data);
               setLoading(false);
               return;
            }
         }

         const response = await axios.get('https://beta.ourmanna.com/api/v1/get/?format=json&order=daily');
         const verseData = response.data.verse.details;

         localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({ date: currentDate, data: verseData })
         );

         setVerse(verseData);
      } catch (err) {
         console.error('Error fetching verse:', err);
         setError('Unable to load the verse of the day. Please try again later.');
      } finally {
         setLoading(false);
         setTodayKey(getTodayDateKey()); // update local state
      }
   };

   useEffect(() => {
      loadVerse();

      // Auto refresh at midnight
      const intervalId = setInterval(() => {
         const newDateKey = getTodayDateKey();
         if (newDateKey !== todayKey) {
            loadVerse(true); // force fetch new verse
         }
      }, 60 * 1000); // check every 1 minute

      return () => clearInterval(intervalId);
   }, [todayKey]);

   const verseDisplay = useMemo(() => {
      if (!verse) return null;
      return {
         text: verse.text,
         reference: verse.reference,
      };
   }, [verse]);

   return (
      <section className='bg-zinc-900'>
         <div className="text-zinc-100 py-10 px-6 text-center rounded-xl shadow-lg mx-4 md:mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
               { loading ? (
                  <motion.div
                     key="loading"
                     initial={ { opacity: 0 } }
                     animate={ { opacity: 1 } }
                     exit={ { opacity: 0 } }
                     className="flex flex-col items-center gap-2"
                  >
                     <Loader className="animate-spin text-blue-400 w-6 h-6" />
                     <p className="text-sm text-zinc-300">Fetching today’s verse...</p>
                  </motion.div>
               ) : error ? (
                  <motion.div
                     key="error"
                     initial={ { opacity: 0 } }
                     animate={ { opacity: 1 } }
                     exit={ { opacity: 0 } }
                     className="flex flex-col items-center gap-2 text-red-500"
                  >
                     <AlertCircle className="w-6 h-6" />
                     <p className="text-sm">{ error }</p>
                  </motion.div>
               ) : (
                  <motion.div
                     key="verse"
                     initial={ { opacity: 0, y: 10 } }
                     animate={ { opacity: 1, y: 0 } }
                     exit={ { opacity: 0 } }
                     transition={ { duration: 0.4 } }
                  >
                     <div className="flex items-center justify-center mb-4 gap-2">
                        <BookOpenText className="text-purple-400 w-6 h-6" />
                        <h2 className="text-2xl font-bold text-purple-400">Verse of the Day</h2>
                     </div>
                     <blockquote className="relative italic text-lg max-w-2xl mx-auto mb-6 text-zinc-200 px-6">
                        <Quote className="absolute -left-2 -top-1 text-purple-400 w-5 h-5 rotate-180" />
                        { verseDisplay.text }
                     </blockquote>
                     <p className="text-blue-400 font-medium">{ verseDisplay.reference } <span className="text-sm text-zinc-400 ml-1">(NIV)</span></p>
                  </motion.div>
               ) }
            </AnimatePresence>
         </div>
      </section>
   );
};

export default FeaturedScripture;
