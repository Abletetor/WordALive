import { useEffect, useState } from 'react';
import { MessageSquareQuote, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { quotes } from '../assets/assets';
import fallbackAvatar from '../assets/Pastorchris.jpg';

const LOCAL_STORAGE_KEY = 'dailyQuote';

const getTodayKey = () => {
   const today = new Date();
   return today.toISOString().split('T')[0];
};

const QuoteOfTheDay = () => {
   const [quote, setQuote] = useState(null);
   const [typedText, setTypedText] = useState('');
   const [todayKey, setTodayKey] = useState(getTodayKey());
   const [imageError, setImageError] = useState(false);

   // Typewriter effect
   useEffect(() => {
      if (!quote?.text) return;

      let index = 0;
      setTypedText('');
      const interval = setInterval(() => {
         setTypedText((prev) => prev + quote.text.charAt(index));
         index++;
         if (index >= quote.text.length) clearInterval(interval);
      }, 30);

      return () => clearInterval(interval);
   }, [quote]);

   // Daily quote selection
   useEffect(() => {
      const fetchQuote = () => {
         const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
         const currentKey = getTodayKey();

         if (stored) {
            try {
               const { date, quote } = JSON.parse(stored);
               if (date === currentKey && quote?.text) {
                  setQuote(quote);
                  return;
               }
            } catch (e) {
               console.warn('Corrupted quote:', e);
            }
         }

         const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
         const safeQuote = {
            ...randomQuote,
            image: typeof randomQuote.image === 'string' ? randomQuote.image : String(randomQuote.image),
         };

         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ date: currentKey, quote: safeQuote }));
         setQuote(safeQuote);
         setImageError(false);
      };

      fetchQuote();

      const intervalId = setInterval(() => {
         const nowKey = getTodayKey();
         if (nowKey !== todayKey) {
            setTodayKey(nowKey);
            fetchQuote();
         }
      }, 60 * 1000);

      return () => clearInterval(intervalId);
   }, [todayKey]);

   const handleShare = () => {
      if (!quote) return;
      const shareText = `${quote.text} — ${quote.author}`;
      if (navigator.share) {
         navigator
            .share({ title: 'Quote of the Day', text: shareText, url: window.location.href })
            .catch((err) => console.error('Share failed:', err));
      } else {
         navigator.clipboard.writeText(shareText);
         alert('Quote copied to clipboard!');
      }
   };

   if (!quote) return null;

   return (
      <section className="bg-zinc-900 px-4 py-10">
         <motion.div
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl shadow-md text-center text-zinc-100 max-w-3xl mx-auto relative"
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.5 } }
         >
            <div className="flex items-center justify-center gap-2 mb-4">
               <MessageSquareQuote className="text-purple-400 w-6 h-6" />
               <h2 className="text-xl font-semibold text-purple-400">Quote of the Day</h2>
            </div>

            <blockquote className="italic text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed min-h-[80px]">
               “{ typedText }”
               <span className="animate-pulse text-purple-400">|</span>
            </blockquote>

            <div className="flex items-center justify-center mt-6 gap-4 flex-wrap">
               <img
                  src={ imageError ? fallbackAvatar : quote.image }
                  onError={ () => setImageError(true) }
                  alt={ quote.author }
                  className="w-12 h-12 rounded-full object-cover border border-purple-500"
               />
               <p className="text-blue-400 text-sm font-medium">— { quote.author }</p>
               <button
                  onClick={ handleShare }
                  className="ml-2 text-zinc-400 hover:text-purple-400 transition"
                  aria-label="Share Quote"
               >
                  <Share2 size={ 20 } />
               </button>
            </div>
         </motion.div>
      </section>
   );
};

export default QuoteOfTheDay;
