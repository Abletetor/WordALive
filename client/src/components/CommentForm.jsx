import { useState } from "react";
import { Send, Loader } from "lucide-react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CommentForm = ({ slug, backendUrl, userToken, onCommentPosted }) => {
   const [text, setText] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!userToken) {
         toast.warn("Please log in to leave a comment.");
         navigate("/login");
         scrollTo(0, 0);
         return;
      }

      const trimmed = text.trim();
      if (!trimmed) {
         toast.warn("Comment cannot be empty");
         return;
      }

      try {
         setLoading(true);

         const { data } = await axios.post(`${backendUrl}/api/comments/${slug}`, {
            text: trimmed,
         }, {
            headers: { Authorization: `Bearer ${userToken}` },
         });

         if (data.success) {
            toast.success(data.message);
            setText("");
            onCommentPosted();
         } else {
            toast.error(data.message || "Failed to post comment");
         }
      } catch (error) {
         console.error("Error posting comment:", error);
         toast.error(error.response?.data?.message || "Failed to post comment");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={ handleSubmit } className="flex flex-col gap-4">
         <textarea
            rows="4"
            placeholder="Write your comment..."
            value={ text }
            onChange={ (e) => setText(e.target.value) }
            className="bg-zinc-800 text-zinc-100 rounded-md p-3 resize-none"
            required
         />
         <button
            type="submit"
            className="self-start bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition cursor-pointer"
            disabled={ loading }
         >
            { loading ? (
               <Loader className="animate-spin w-5 h-5 text-white" />
            ) : (
               <>
                  <Send size={ 16 } />
                  Post Comment
               </>
            ) }
         </button>
      </form>
   );
};

export default CommentForm;