import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, FileSearch2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AppContext } from '../context/AppContext';


const SearchResults = () => {
   const [searchParams] = useSearchParams();
   const query = searchParams.get('q');
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(true);
   const { backendUrl } = useContext(AppContext);

   useEffect(() => {
      if (!query) return;

      const fetchResults = async () => {
         try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/posts/search?q=${encodeURIComponent(query)}&type=full`);
            setResults(res.data.results || []);
         } catch (err) {
            console.error('Search failed:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchResults();
   }, [query]);

   return (
      <section className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
         <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6 } }
            className="max-w-4xl mx-auto"
         >
            <h1 className="text-3xl font-bold text-purple-400 mb-8">
               Search Results for: <span className="text-zinc-100">“{ query }”</span>
            </h1>

            { loading ? (
               <div className="flex justify-center items-center mt-20">
                  <Loader2 className="animate-spin text-purple-500 w-6 h-6" />
               </div>
            ) : results.length === 0 ? (
               <div className="text-center mt-20 text-zinc-400">
                  <FileSearch2 className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                  <p>No posts found matching your search.</p>
               </div>
            ) : (
               <div className="space-y-8">
                  { results.map((post) => (
                     <motion.div
                        key={ post._id }
                        whileHover={ { scale: 1.02 } }
                        transition={ { duration: 0.3 } }
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md"
                     >
                        <Link to={ `/posts/${post.slug}` }>
                           <h2 className="text-2xl font-semibold text-purple-300 hover:underline">
                              { post.title }
                           </h2>
                        </Link>
                        <p className="text-zinc-400 mt-2 text-sm">{ new Date(post.createdAt).toLocaleDateString() }</p>
                        <p className="mt-4 text-zinc-300">{ post.excerpt }</p>
                        <div className="mt-4">
                           <Link
                              to={ `/posts/${post.slug}` }
                              className="text-sm text-blue-400 hover:underline font-medium"
                           >
                              Read more →
                           </Link>
                        </div>
                     </motion.div>
                  )) }
               </div>
            ) }
         </motion.div>
      </section>
   );
};

export default SearchResults;
