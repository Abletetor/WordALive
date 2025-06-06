import { useState, useContext } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { MoreVertical } from "lucide-react";
import { AppContext } from "../context/AppContext";
import moment from 'moment';

const CommentList = ({ comments }) => {
   const [menuOpenId, setMenuOpenId] = useState(null);
   const [editModeId, setEditModeId] = useState(null);
   const [editedText, setEditedText] = useState("");
   const { backendUrl, userToken } = useContext(AppContext);

   const currentUserId = userToken ? JSON.parse(atob(userToken.split('.')[1]))._id : null;

   const toggleMenu = (commentId) => {
      setMenuOpenId(prev => (prev === commentId ? null : commentId));
   };

   const startEditing = (commentId, currentContent) => {
      setEditModeId(commentId);
      setEditedText(currentContent);
      setMenuOpenId(null);
   };

   const cancelEdit = () => {
      setEditModeId(null);
      setEditedText("");
   };

   const saveEdit = async (commentId) => {
      try {
         const { data } = await axios.put(
            `${backendUrl}/api/comments/${commentId}`,
            { text: editedText.trim() },
            { headers: { Authorization: `Bearer ${userToken}` } }
         );

         if (data.success) {
            toast.success(data.message);
            setEditModeId(null);
            setEditedText("");
            fetchComments();
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         console.error("Error updating comment:", error);
         toast.error(error.response?.data?.message || "Failed to update comment");
      }
   };

   return (
      <div className="mt-8 space-y-6 border-t border-zinc-800 pt-6">
         <h3 className="text-lg font-semibold text-red-100 mb-4">Comments ({ comments.length })</h3>
         { comments.length === 0 ? (
            <p className="text-sm text-zinc-400">No comments yet. Be the first!</p>
         ) : (
            comments.map((comment) => (
               <div key={ comment._id } className="flex gap-3 items-start relative">
                  <img
                     src={ comment.user.avatar }
                     alt={ comment.user.name }
                     className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-100">
                           { comment.user.name }
                        </p>
                        {/* Date */ }
                        <p className="text-xs text-zinc-500 mt-0.5">
                           { moment(comment.createdAt).format("MMMM D, YYYY • h:mm A") }
                        </p>

                     </div>

                     { editModeId === comment._id ? (
                        <div className="mt-2">
                           <textarea
                              value={ editedText }
                              onChange={ (e) => setEditedText(e.target.value) }
                              rows="3"
                              className="w-full bg-zinc-800 text-zinc-100 p-2 rounded-md"
                           />
                           <div className="flex gap-3 mt-2">
                              <button
                                 onClick={ () => saveEdit(comment._id) }
                                 className="text-sm text-blue-400 hover:underline"
                              >
                                 Save
                              </button>
                              <button
                                 onClick={ cancelEdit }
                                 className="text-sm text-zinc-400 hover:underline"
                              >
                                 Cancel
                              </button>
                           </div>
                        </div>
                     ) : (
                        <p className="text-sm text-zinc-300 mt-1">{ comment.content }</p>
                     ) }
                  </div>

                  { currentUserId === comment.user.id && (
                     <div className="absolute right-0 top-0">
                        <button
                           className="text-zinc-400 hover:text-white p-1"
                           onClick={ () => toggleMenu(comment._id) }
                        >
                           <MoreVertical size={ 18 } />
                        </button>

                        { menuOpenId === comment._id && (
                           <div className="absolute right-6 top-0 bg-zinc-800 border border-zinc-700 rounded-md shadow-md p-2 z-10">
                              <button
                                 className="text-sm text-blue-400 hover:underline cursor-pointer"
                                 onClick={ () => startEditing(comment._id, comment.content) }
                              >
                                 Edit
                              </button>
                           </div>
                        ) }
                     </div>
                  ) }
               </div>
            ))
         ) }
      </div>
   );
};

export default CommentList;
