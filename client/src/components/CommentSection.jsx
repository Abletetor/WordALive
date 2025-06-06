import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CommentSection = ({ onCommentPosted }) => {
   const { slug } = useParams();
   const { backendUrl, userToken } = useContext(UserContext);
   const [comments, setComments] = useState([]);

   const fetchComments = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/comments/${slug}`);
         if (data.success) {
            setComments(data.comments);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         console.error("Error fetching comments:", error);
         toast.error(error.response?.data?.message || "Failed to fetch comments");
      }
   };

   useEffect(() => {
      fetchComments();
   }, [slug]);

   const handleCommentPosted = async () => {
      await fetchComments();        // Refresh comments list
      if (onCommentPosted) {
         onCommentPosted();
      }
   };

   return (
      <div className="mt-16 bg-zinc-900 p-6 rounded-xl shadow-md">
         <h3 className="text-xl font-semibold text-zinc-100 mb-4">Leave a Comment</h3>
         <CommentForm
            slug={ slug }
            backendUrl={ backendUrl }
            userToken={ userToken }
            onCommentPosted={ handleCommentPosted }
         />
         <CommentList comments={ comments } />
      </div>
   );
};

export default CommentSection;
