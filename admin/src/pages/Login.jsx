import { useState, useContext } from 'react';
import { Eye, EyeOff, LogIn, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
   const [formData, setFormData] = useState({ email: '', password: '' });
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const { backendUrl, setAdminToken, axiosAuth } = useContext(AdminContext);

   const handleChange = (e) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const { data } = await axiosAuth.post(`${backendUrl}/api/admin/login`, formData);
         if (data.success) {
            localStorage.setItem('adminToken', data.token);
            setAdminToken(data.token);
            toast.success(data.message);
            navigate('/');
         } else {
            toast.error(data.message);
         }
      } catch (err) {
         toast.error(err.response?.data?.message || "Something went wrong");
         console.log(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <section className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
         <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.4 } }
            className="w-full max-w-md bg-[#1a1a1a] rounded-xl shadow-lg p-8 text-gray-200"
         >
            <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

            <form onSubmit={ handleSubmit } className="space-y-4">
               {/* Email */ }
               <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                     type="email"
                     name="email"
                     className="w-full px-4 py-2 bg-[#2b2b2b] border border-gray-600 rounded-lg"
                     placeholder="admin@example.com"
                     value={ formData.email }
                     onChange={ handleChange }
                     required
                  />
               </div>

               {/* Password */ }
               <div>
                  <label className="block text-sm mb-1">Password</label>
                  <div className="relative">
                     <input
                        type={ showPassword ? 'text' : 'password' }
                        name="password"
                        className="w-full px-4 py-2 bg-[#2b2b2b] border border-gray-600 rounded-lg pr-10"
                        placeholder="password"
                        value={ formData.password }
                        onChange={ handleChange }
                        required
                     />
                     <span
                        onClick={ () => setShowPassword(!showPassword) }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                     >
                        { showPassword ? <EyeOff size={ 18 } /> : <Eye size={ 18 } /> }
                     </span>
                  </div>
               </div>

               {/* Submit */ }
               <button
                  type="submit"
                  disabled={ loading }
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all"
               >

                  { loading ? (
                     <Loader className="animate-spin w-5 h-5 text-white" />
                  ) : (
                     <>
                        <LogIn size={ 16 } />
                        Login as Admin
                     </>
                  )
                  }
               </button>
            </form>
         </motion.div>
      </section>
   );
};

export default Login;
