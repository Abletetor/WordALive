import { useContext, useState } from 'react';
import { Plus, ImagePlus, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

const CreatePost = () => {
   const { backendUrl, adminToken, axiosAuth, getAllPosts } = useContext(AdminContext);

   const [formData, setFormData] = useState({
      title: '', excerpt: '', content: '',
      image: null, tags: '', category: '',
      readingTime: '', authorName: '',
      authorBio: '', authorAvatar: '',
   });

   const [imagePreview, setImagePreview] = useState(null);
   const [authorAvatarPreview, setAuthorAvatarPreview] = useState(null);
   const [loading, setLoading] = useState(false);
   const handleChange = (e) => {
      const { name, value, files } = e.target;

      if (name === 'image') {
         const file = files[0];
         setFormData({ ...formData, image: file });
         if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
         } else {
            setImagePreview(null);
         }
      } else if (name === 'authorAvatar') {
         const file = files[0];
         setFormData({ ...formData, authorAvatar: file });
         if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAuthorAvatarPreview(reader.result);
            reader.readAsDataURL(file);
         } else {
            setAuthorAvatarPreview(null);
         }
      } else {
         setFormData({ ...formData, [name]: value });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const form = new FormData();

         form.append("title", formData.title);
         form.append("excerpt", formData.excerpt);
         form.append("content", formData.content);
         form.append("tags", formData.tags);
         form.append("category", formData.category);
         form.append("readingTime", formData.readingTime);
         form.append("authorName", formData.authorName);
         form.append("authorBio", formData.authorBio);

         if (formData.image) {
            form.append("image", formData.image);
         }

         if (formData.authorAvatar) {
            form.append("authorAvatar", formData.authorAvatar);
         }

         const { data } = await axiosAuth.post(`${backendUrl}/api/posts/create`, form, {
            headers: {
               Authorization: `Bearer ${adminToken}`,
               'Content-Type': 'multipart/form-data'
            }
         });

         if (data.success) {
            toast.success(data.message);
            setFormData({
               title: '', excerpt: '', content: '',
               image: null, tags: '', category: '',
               readingTime: '', authorName: '',
               authorBio: '', authorAvatar: '',
            });
            setImagePreview(null);
            setAuthorAvatarPreview(null);
            getAllPosts();
         } else {
            toast.error(data.message);
         }

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };


   return (
      <section className='bg-[#0f0f0f]'>
         <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.4 } }
            className="container mx-auto min-h-screen p-6 text-gray-200"
         >
            <h1 className="text-2xl font-semibold mb-6">Create New Blog Post</h1>

            <form onSubmit={ handleSubmit } className="grid grid-cols-1 md:grid-cols-2 gap-6">

               {/* Left Column */ }
               <div className="space-y-4">
                  {/* Title */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Title</label>
                     <input
                        type="text"
                        name="title"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="Post Title"
                        value={ formData.title }
                        onChange={ handleChange }
                        required
                     />
                  </div>

                  {/* Excerpt */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Excerpt</label>
                     <textarea
                        name="excerpt"
                        rows="3"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="Short summary..."
                        value={ formData.excerpt }
                        onChange={ handleChange }
                        required
                     />
                  </div>

                  {/* Content */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Content</label>
                     <textarea
                        name="content"
                        rows="10"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        placeholder="Write your content here..."
                        value={ formData.content }
                        onChange={ handleChange }
                        required
                     />
                  </div>
               </div>

               {/* Right Column */ }
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
                        { formData.image && (
                           <span className="text-sm text-gray-400 truncate max-w-[160px]">{ formData.image.name }</span>
                        ) }
                     </div>
                     { imagePreview && (
                        <img src={ imagePreview } alt="Preview" className="mt-3 rounded-lg w-full max-h-48 object-cover" />
                     ) }
                  </div>

                  {/* Tags */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Tags</label>
                     <input
                        type="text"
                        name="tags"
                        placeholder="e.g. JavaScript, Programming"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        value={ formData.tags }
                        onChange={ handleChange }
                     />
                  </div>

                  {/* Category (Text Input) */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Category</label>
                     <input
                        type="text"
                        name="category"
                        placeholder="e.g. JavaScript"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        value={ formData.category }
                        onChange={ handleChange }
                     />
                  </div>

                  {/* Reading Time */ }
                  <div>
                     <label className="block text-sm font-medium mb-1">Reading Time</label>
                     <input
                        type="text"
                        name="readingTime"
                        placeholder="e.g. 6 min read"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        value={ formData.readingTime }
                        onChange={ handleChange }
                     />
                  </div>

                  {/* Author Info */ }
                  <div className="space-y-2 mt-4">
                     <p className="font-semibold text-sm">Author Info</p>

                     <input
                        type="text"
                        name="authorName"
                        placeholder="Author Name"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        value={ formData.authorName }
                        onChange={ handleChange }
                     />

                     <input
                        type="text"
                        name="authorBio"
                        placeholder="Author Bio"
                        className="w-full bg-[#1c1c1c] border border-gray-600 rounded-lg px-4 py-2"
                        value={ formData.authorBio }
                        onChange={ handleChange }
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
                           { formData.authorAvatar && (
                              <span className="text-sm text-gray-400 truncate max-w-[160px]">
                                 { formData.authorAvatar.name }
                              </span>
                           ) }
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
               </div>

               {/* Submit */ }
               <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
                  <button
                     type="submit"
                     className={ `bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}` }
                     disabled={ loading }
                  >
                     { loading ? (
                        <Loader className="animate-spin w-5 h-5 text-gray-400" />
                     ) : (
                        <>
                           <Plus className="w-5 h-5 mr-2" />
                           Publish Post
                        </>
                     ) }
                  </button>
               </div>
            </form>
         </motion.div>
      </section>
   );
};

export default CreatePost;
