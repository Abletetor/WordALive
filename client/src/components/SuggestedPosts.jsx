import PostCard from "./PostCard";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const SuggestedPosts = ({ currentSlug }) => {
   const { posts } = useContext(AppContext);
   const suggestions = posts
      .filter(post => post.slug !== `${currentSlug}`)
      .slice(0, 3);

   return (
      <div className="mt-20">
         <h3 className="text-xl font-semibold text-zinc-100 mb-6">You might also like</h3>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            { suggestions.map(post => (
               <PostCard key={ post.id } post={ post } />
            )) }
         </div>
      </div>
   );
};

export default SuggestedPosts;
