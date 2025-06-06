import { ArrowRightCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToSalvation = () => {
   return (
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 px-6 py-12 text-center text-zinc-100 mt-10 rounded-xl shadow-md">
         <motion.div
            initial={ { opacity: 0, y: 20 } }
            whileInView={ { opacity: 1, y: 0 } }
            viewport={ { once: true } }
            transition={ { duration: 0.6, ease: 'easeOut' } }
         >
            <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">
               Do You Want to Give Your Life to Christ?
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
               Today is the day of salvation. If you feel the call in your heart, don’t delay.
               Jesus is ready to welcome you with open arms. Start your new life in Him now.
            </p>

            <Link
               to="/salvation"
               onClick={ () => scrollTo(0, 0) }
               className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition duration-300"
            >
               Take the Step <ArrowRightCircle size={ 20 } />
            </Link>
         </motion.div>
      </section>
   );
};

export default CallToSalvation;
