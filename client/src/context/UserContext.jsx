import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useCallback } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || null);

   const [user, setUser] = useState(null);
   const [posts, setPosts] = useState([]);
   const [singlePost, setSinglePost] = useState(null);
   const [loading, setLoading] = useState(true);
   const [liked, setLiked] = useState(false);



   const [pagination, setPagination] = useState({
      page: 1,
      limit: 10,
      totalPages: 0,
      total: 0
   });

   // ** Get All Posts **
   const getAllPosts = async (page = 1, limit = 10) => {
      setLoading(true);
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/all-post?page=${page}&limit=${limit}`);
         if (data.success) {
            setPosts(data.posts);
            setPagination(data.pagination);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Error fetching posts");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   // ** Get Single Post **
   const getSinglePost = useCallback(async (slug) => {
      setLoading(true);
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/view/${slug}`);
         if (data.success) {
            setSinglePost(data.post);
            setLiked(data.liked);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Error fetching post");
         console.error(error);
      } finally {
         setLoading(false);
      }
   }, [backendUrl]);



   useEffect(() => {
      getAllPosts();
   }, []);

   const value = {
      backendUrl, loading, setLoading,
      getAllPosts, posts, setPosts,
      pagination, setPagination,
      getSinglePost, singlePost, setSinglePost,
      userToken, setUserToken,
      user, setUser, liked, setLiked,
   };

   return (
      <UserContext.Provider value={ value }>
         { props.children }
      </UserContext.Provider>
   );
};

export default UserContextProvider;