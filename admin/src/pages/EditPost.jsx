import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImagePlus, Loader, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';

const EditPost = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { backendUrl, adminToken, axiosAuth, getSinglePost, getAllPosts } = useContext(AdminContext);

   const [formData, setFormData] = useState({
      title: '', excerpt: '', content: '',
      image: null, tags: '', category: '',
      readingTime: '', authorName: '',
      authorBio: '', authorAvatar: null,
   });

   const [imagePreview, setImagePreview] = useState(null);
   const [authorAvatarPreview, setAuthorAvatarPreview] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchPost = async () => {
         setLoading(true);
         const res = await getSinglePost(id);
         if (res.success) {
            const post = res.post;
            setFormData({
               title: post.title || '',
               excerpt: post.excerpt || '',
               content: post.content || '',
               image: null,
               tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
               category: post.category || '',
               readingTime: post.readingTime || '',
               authorName: post.author?.name || '',
               authorBio: post.author?.bio || '',
               authorAvatar: null,
            });
            setImagePreview(post.image);
            setAuthorAvatarPreview(post.author?.avatar);
         } else {
            toast.error(res.message || 'Failed to fetch post');
         }
         setLoading(false);
      };

      if (id) fetchPost();
   }, [id, getSinglePost]);

   const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files && files[0]) {
         const file = files[0];
         setFormData(prev => ({ ...prev, [name]: file }));
         const reader = new FileReader();
         reader.onloadend = () => {
            if (name === 'image') setImagePreview(reader.result);
            if (name === 'authorAvatar') setAuthorAvatarPreview(reader.result);
         };
         reader.readAsDataURL(file);
      } else {
         setFormData(prev => ({ ...prev, [name]: value }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const form = new FormData();
         Object.entries(formData).forEach(([key, val]) => {
            if (val) form.append(key, val);
         });

         const { data } = await axiosAuth.put(
            `${backendUrl}/api/posts/edit/${id}`,
            form,
            {
               headers: {
                  Authorization: `Bearer ${adminToken}`,
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         if (data.success) {
            toast.success('Post updated successfully!');
            getAllPosts();
            navigate('/all-posts');
         } else {
            toast.error(data.message || 'Update failed.');
         }
      } catch (err) {
         console.error(err);
         toast.error(err.response?.data?.message || 'Update failed.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <section className="bg-[#0f0f0f]">
         <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.4 } }
            className="container mx-auto min-h-screen p-6 text-gray-200"
         >
            <h1 className="text-2xl font-semibold mb-6">Edit Blog Post</h1>

            <form onSubmit={ handleSubmit } className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* LEFT SIDE */ }
               <div className="space-y-4">
                  <input
                     type="text"
                     name="title"
                     placeholder="Title"
                     value={ formData.title }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                     required
                  />
                  <textarea
                     name="excerpt"
                     placeholder="Excerpt"
                     value={ formData.excerpt }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                     rows={ 3 }
                     required
                  />
                  <textarea
                     name="content"
                     placeholder="Content"
                     value={ formData.content }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                     rows={ 6 }
                     required
                  />
               </div>

               {/* RIGHT SIDE */ }
               <div className="space-y-4">
                  {/* Banner Image */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Banner Image</label>
                     <div className="flex items-center gap-3">
                        <label className="cursor-pointer flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                           <ImagePlus className="w-4 h-4 mr-2" />
                           Upload
                           <input
                              type="file"
                              name="image"
                              accept="image/*"
                              className="hidden"
                              onChange={ handleChange }
                           />
                        </label>
                        <span className="text-sm text-gray-400 truncate max-w-[160px]">
                           { formData.image?.name || imagePreview?.split('/').pop() }
                        </span>
                     </div>
                     { imagePreview && (
                        <img src={ imagePreview } alt="Preview" className="mt-3 rounded-lg w-full max-h-48 object-cover" />
                     ) }
                  </div>

                  <input
                     type="text"
                     name="tags"
                     placeholder="Tags (comma separated)"
                     value={ formData.tags }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                  />
                  <input
                     type="text"
                     name="category"
                     placeholder="Category"
                     value={ formData.category }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                  />
                  <input
                     type="text"
                     name="readingTime"
                     placeholder="Reading Time (e.g. 5 min)"
                     value={ formData.readingTime }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                  />

                  {/* Author Info */ }
                  <input
                     type="text"
                     name="authorName"
                     placeholder="Author Name"
                     value={ formData.authorName }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                  />
                  <textarea
                     name="authorBio"
                     placeholder="Author Bio"
                     value={ formData.authorBio }
                     onChange={ handleChange }
                     className="w-full p-3 rounded bg-gray-800 text-white"
                     rows={ 2 }
                  />
                  <div>
                     <label className="block text-sm font-medium mb-1">Author Avatar</label>
                     <div className="flex items-center gap-3">
                        <label className="cursor-pointer flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                           <ImagePlus className="w-4 h-4 mr-2" />
                           Upload
                           <input
                              type="file"
                              name="authorAvatar"
                              accept="image/*"
                              className="hidden"
                              onChange={ handleChange }
                           />
                        </label>
                        <span className="text-sm text-gray-400 truncate max-w-[160px]">
                           { formData.authorAvatar?.name || authorAvatarPreview?.split('/').pop() }
                        </span>
                     </div>
                     { authorAvatarPreview && (
                        <img
                           src={ authorAvatarPreview }
                           alt="Author Avatar Preview"
                           className="mt-3 rounded-full w-20 h-20 object-cover border border-gray-600"
                        />
                     ) }
                  </div>
               </div>

               {/* Submit Button */ }
               <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
                  <button
                     type="submit"
                     className={ `bg-green-600 hover:bg-green-700 transition-all text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}` }
                     disabled={ loading }
                  >
                     { loading ? (
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                     ) : (
                        <>
                           <Save className="w-5 h-5 mr-2" />
                           Save Changes
                        </>
                     ) }
                  </button>
               </div>
            </form>
         </motion.div>
      </section>
   );
};

export default EditPost;
