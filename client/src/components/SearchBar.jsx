import { useEffect, useRef, useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { AppContext } from '../context/AppContext';

const SearchBar = () => {
   const [query, setQuery] = useState('');
   const [suggestions, setSuggestions] = useState([]);
   const [showDropdown, setShowDropdown] = useState(false);
   const navigate = useNavigate();
   const inputRef = useRef(null);
   const { backendUrl } = useContext(AppContext);

   // Debounced search function
   const debouncedSearch = useRef(
      debounce(async (q) => {
         const trimmed = q.trim();
         if (!trimmed) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
         }

         try {
            const { data } = await axios.get(
               `${backendUrl}/api/posts/search?q=${encodeURIComponent(trimmed)}&type=suggestion`,
               { withCredentials: false }
            );

            if (data?.results?.length) {
               setSuggestions(data.results);
               setShowDropdown(true);
            } else {
               setSuggestions([]);
               setShowDropdown(false);
            }
         } catch (error) {
            console.error('Suggestion fetch error:', error);
            setSuggestions([]);
            setShowDropdown(false);
         }
      }, 300)
   ).current;


   useEffect(() => {
      debouncedSearch(query);
   }, [query]);

   // Hide dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (!inputRef.current?.contains(e.target)) {
            setShowDropdown(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleSearch = (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setQuery('');
   };

   const handleSuggestionClick = (slug) => {
      navigate(`/posts/${slug}`);
      setShowDropdown(false);
      setQuery('');
   };

   return (
      <div className="relative w-full max-w-sm" ref={ inputRef }>
         <form onSubmit={ handleSearch }>
            <input
               type="text"
               value={ query }
               onChange={ (e) => {
                  const val = e.target.value;
                  setQuery(val);
                  debouncedSearch(val);
               } }
               placeholder="Search articles..."
               className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={ 18 } />
         </form>

         { showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
               { suggestions.map((post) => (
                  <li
                     key={ post._id }
                     onClick={ () => handleSuggestionClick(post.slug) }
                     className="px-4 py-2 cursor-pointer hover:bg-zinc-800 text-sm text-zinc-200 transition"
                  >
                     { post.title }
                  </li>
               )) }
            </ul>
         ) }
      </div>
   );
};

export default SearchBar;
