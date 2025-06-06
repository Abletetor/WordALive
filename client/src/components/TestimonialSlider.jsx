import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../assets/assets';

const sliderVariants = {
   initial: { opacity: 0, x: 30 },
   animate: { opacity: 1, x: 0 },
   exit: { opacity: 0, x: -30 },
};

const TestimonySlider = () => {
   const [index, setIndex] = useState(0);

   const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
   const prev = () =>
      setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

   useEffect(() => {
      const interval = setInterval(next, 8000);
      return () => clearInterval(interval);
   }, []);

   return (
      <section className="bg-zinc-900 py-12 px-4 text-zinc-100">
         <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6 gap-2">
               <Quote className="w-6 h-6 text-purple-400" />
               <h2 className="text-2xl font-semibold text-purple-400">Testimonies</h2>
            </div>

            <div className="relative">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={ index }
                     className="bg-zinc-950 rounded-2xl p-6 shadow-lg mx-auto"
                     variants={ sliderVariants }
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={ { duration: 0.5 } }
                  >
                     <p className="italic text-lg text-zinc-300 mb-4 leading-relaxed">
                        “{ testimonials[index].text }”
                     </p>
                     <div className="flex items-center justify-center gap-4">
                        { testimonials[index].image && (
                           <img
                              src={ testimonials[index].image }
                              alt={ testimonials[index].name }
                              className="w-12 h-12 rounded-full object-cover border border-purple-500"
                           />
                        ) }
                        <div>
                           <p className="text-blue-400 font-medium text-sm">{ testimonials[index].name }</p>
                           <p className="text-zinc-500 text-xs">{ testimonials[index].location }</p>
                        </div>
                     </div>
                  </motion.div>
               </AnimatePresence>

               <div className="flex justify-between mt-6 px-8">
                  <button
                     onClick={ prev }
                     className="text-zinc-400 bg-zinc-950 p-3 rounded-full shadow-md hover:text-purple-400 hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300 ease-in-out"
                     aria-label="Previous Testimony"
                  >
                     <ChevronLeft size={ 20 } />
                  </button>
                  <button
                     onClick={ next }
                     className="text-zinc-400 bg-zinc-950 p-3 rounded-full shadow-md hover:text-purple-400 hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300 ease-in-out"
                     aria-label="Next Testimony"
                  >
                     <ChevronRight size={ 20 } />
                  </button>
               </div>

            </div>
         </div>
      </section>
   );
};

export default TestimonySlider;
