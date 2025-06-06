import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { motion } from "framer-motion";
import {
   CalendarDays, Timer, User, ArrowLeft,
   UserIcon, Heart, MessageCircle, Eye, Loader, Tag,
} from "lucide-react";
import CommentSection from "../components/CommentSection";
import SuggestedPosts from "../components/SuggestedPosts";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import PostContent from "../components/PostContent";
import CallToSalvation from "../components/CallToSalvation";

const PostDetail = () => {
   const {
      getSinglePost,
      singlePost,
      loading,
      backendUrl,
      userToken,
      liked,
      setLiked,
   } = useContext(AppContext);

   const { slug } = useParams();
   const navigate = useNavigate();

   const [likes, setLikes] = useState(0);

   // Fetch post initially
   useEffect(() => {
      if (slug) getSinglePost(slug);
   }, [slug, getSinglePost]);

   // Update likes state when post changes
   useEffect(() => {
      if (singlePost) {
         setLikes(singlePost.likes || 0);
      }
   }, [singlePost]);

   // refresh the post data
   const refreshPost = () => {
      if (slug) getSinglePost(slug);
   };

   const handleLike = async () => {
      if (!userToken) {
         toast.warn("Please log in to like posts");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/posts/like/${singlePost.slug}`,
            {},
            {
               headers: {
                  Authorization: `Bearer ${userToken}`,
               },
            }
         );

         if (data.success) {
            setLikes(data.likes);
            setLiked(data.liked);
         } else {
            toast.error(data.message || "Failed to toggle like");
         }
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Error toggling like"
         );
         console.error(err);
      }
   };

   if (loading || !singlePost) {
      return (
         <div className="bg-zinc-950 min-h-screen flex justify-center items-center">
            <Loader className="text-purple-400 w-10 h-10 animate-spin" />
         </div>
      );
   }

   const post = singlePost;

   return (
      <div className="bg-zinc-950 text-zinc-100 min-h-screen w-full">
         <motion.section
            initial={ { opacity: 0, y: 30 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6 } }
            className="max-w-4xl mx-auto py-16 px-4 md:px-6"
         >
            <button
               onClick={ () => { navigate(-1); scrollTo(0, 0); } }
               className="mb-6 flex items-center gap-2 text-sm text-purple-400 hover:underline cursor-pointer"
            >
               <ArrowLeft size={ 16 } /> Back
            </button>

            <img
               src={ post.image }
               alt={ post.title }
               className="w-full h-80 object-cover rounded-xl mb-8 shadow-lg"
            />

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
               { post.title }
            </h1>


            <div className="flex items-center gap-6 text-sm text-zinc-400 mb-6 flex-wrap">
               <span className="flex items-center gap-1">
                  <User size={ 16 } className="text-purple-400" />
                  { post.author?.name }
               </span>
               <span className="flex items-center gap-1">
                  <CalendarDays size={ 16 } className="text-purple-400" />
                  { moment(post.date).format("MMMM D, YYYY • h:mm A") }
               </span>
               <span className="flex items-center gap-1">
                  <Timer size={ 16 } className="text-purple-400" />
                  { post.readingTime }
               </span>
               <span className="flex items-center gap-1">
                  <Eye size={ 16 } className="text-purple-400" />
                  { post.views }
               </span>

               <button
                  onClick={ handleLike }
                  className="flex items-center gap-1 text-purple-400 hover:text-red-500 transition cursor-pointer"
               >
                  { liked ? (
                     <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  ) : (
                     <Heart className="w-5 h-5" />
                  ) }
                  <span>{ likes }</span>
               </button>

               <span className="flex items-center gap-1">
                  <MessageCircle size={ 16 } className="text-purple-400" />
                  { post.commentsCount ?? 0 }
               </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
               { post.tags?.map((tag) => (
                  <span
                     key={ tag }
                     className="bg-zinc-800 text-purple-400 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                  >
                     <Tag size={ 16 } />
                     { tag }
                  </span>
               )) }
            </div>
            {            /* Render post content */ }
            <PostContent content={ post.content } />

            {/* Comment Section with refreshPost passed down */ }
            <CommentSection
               slug={ slug }
               backendUrl={ backendUrl }
               userToken={ userToken }
               onCommentPosted={ refreshPost }
            />
            <CallToSalvation />

            {/* Author Info Section */ }
            <div className="flex items-start gap-4 mt-12 border-t border-zinc-800 pt-6">
               { post.author?.avatar ? (
                  <img
                     src={ post.author?.avatar }
                     alt={ post.author?.name }
                     className="w-12 h-12 rounded-full object-cover"
                  />
               ) : (
                  <UserIcon size={ 16 } className="text-purple-400" />
               ) }

               <div>
                  <p className="text-sm text-blue-400 font-semibold">
                     { post.author?.name }
                  </p>
                  <p className="text-sm text-zinc-400">{ post.author?.bio }</p>
               </div>
            </div>

            <SuggestedPosts currentSlug={ slug } />
         </motion.section>
      </div>
   );
};

export default PostDetail;
