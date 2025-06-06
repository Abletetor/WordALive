import axios from "axios";
import { useState, createContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const navigate = useNavigate();

   const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || null);
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState([]);
   const [pagination, setPagination] = useState({
      page: 1,
      limit: 10,
      totalPages: 0,
      total: 0
   });

   // Create Axios instance
   const axiosAuth = axios.create();

   // Setup interceptor
   useEffect(() => {
      const interceptor = axiosAuth.interceptors.response.use(
         (response) => response,
         (error) => {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 401 && message?.toLowerCase().includes("token expired")) {
               toast.error('Session expired. Please login again.');
               localStorage.removeItem("adminToken");
               setAdminToken(null);
               navigate("/login", { replace: true }); // more explicit redirect
            }

            return Promise.reject(error); // always reject to prevent infinite loops
         }
      );

      return () => axiosAuth.interceptors.response.eject(interceptor);
   }, [adminToken, setAdminToken, navigate]);




   // ** Get All Posts **
   const getAllPosts = async (page = 1, limit = 10) => {
      try {
         setLoading(true);
         const { data } = await axiosAuth.get(`${backendUrl}/api/posts/all?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
         });
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
   const getSinglePost = useCallback(async (id) => {
      try {
         const { data } = await axiosAuth.get(`${backendUrl}/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
         });
         if (data.success) {
            return data;
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Error fetching post");
         console.error(error);
      }
   }, [backendUrl]);

   useEffect(() => {
      getAllPosts();
   }, []);

   const value = {
      backendUrl,
      adminToken, setAdminToken,
      pagination, setPagination,
      posts, setPosts, getAllPosts,
      loading, setLoading,
      getSinglePost, axiosAuth
   };

   return (
      <AdminContext.Provider value={ value }>
         { props.children }
      </AdminContext.Provider>
   );
};

export default AdminContextProvider;