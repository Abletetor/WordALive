import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Loader } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';

const Login = () => {
   const { backendUrl, setUser, setUserToken } = useContext(AppContext);
   const navigate = useNavigate();
   const [isSignUp, setIsSignUp] = useState(false);
   const [email, setEmail] = useState("");
   const [name, setName] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loading, setLoading] = useState(false);

   const toggleMode = () => setIsSignUp((prev) => !prev);

   // Form submission handler
   const submitHandler = async (e) => {
      e.preventDefault();
      if (!email || !password) {
         toast.warn("Please fill all fields");
         return;
      }

      try {
         setLoading(true);
         if (isSignUp) {
            if (password !== confirmPassword) {
               toast.error("Passwords do not match");
               return;
            }
            const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            if (data.success) {
               toast.success("Registration successful! Please login.");
               setIsSignUp(false);
               setName("");
               setEmail("");
               setPassword("");
               setConfirmPassword("");
            } else {
               toast.error(data.message);
            }
         } else {
            const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (data.success) {
               setUserToken(data.token);
               localStorage.setItem("userToken", data.token);
               setUser(data.user);
               navigate('/');
            } else {
               toast.error(data.message);
            }
         }
      } catch (error) {
         console.error(error);
         toast.error(error.response?.data?.message || "An error occurred");
      } finally {
         setLoading(false);
      }

   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-10">
         <div className="w-full max-w-5xl bg-zinc-900 shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

            {/* Left Panel - Branding */ }
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-purple-800 p-10 text-white">
               <motion.h2
                  initial={ { y: 30, opacity: 0 } }
                  animate={ { y: 0, opacity: 1 } }
                  transition={ { duration: 0.6 } }
                  className="text-3xl font-bold mb-4 text-center"
               >
                  { isSignUp ? "Create Your Account" : "Welcome Back" }
               </motion.h2>
               <p className="text-sm text-center max-w-xs">
                  { isSignUp
                     ? "Join the community of developers sharing ideas and learning together."
                     : "Sign in to explore high-quality articles tailored for modern developers." }
               </p>
            </div>

            {/* Right Panel - Form */ }
            <div className="bg-zinc-900 p-8 md:p-12 text-zinc-100">
               <motion.h3
                  initial={ { opacity: 0, y: -10 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { delay: 0.2 } }
                  className="text-2xl font-semibold mb-6"
               >
                  { isSignUp ? "Sign Up" : "Login" }
               </motion.h3>

               <form onSubmit={ submitHandler } className="space-y-4">
                  { isSignUp && (
                     <input
                        type="text"
                        placeholder="Full Name"
                        onChange={ (e) => setName(e.target.value) }
                        value={ name }
                        className="w-full px-4 py-3 rounded-md bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                     />
                  ) }
                  <input
                     type="email"
                     placeholder="Email"
                     onChange={ (e) => setEmail(e.target.value) }
                     value={ email }
                     className="w-full px-4 py-3 rounded-md bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <input
                     type="password"
                     placeholder="Password"
                     onChange={ (e) => setPassword(e.target.value) }
                     value={ password }
                     className="w-full px-4 py-3 rounded-md bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                     required
                  />
                  { isSignUp && (
                     <input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={ (e) => setConfirmPassword(e.target.value) }
                        value={ confirmPassword }
                        className="w-full px-4 py-3 rounded-md bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                     />
                  ) }
                  <button
                     type="submit"
                     className="w-full bg-purple-600 hover:bg-purple-500 transition text-white py-3 rounded-md flex items-center justify-center gap-2 font-semibold cursor-pointer"
                     disabled={ loading }
                  >
                     { loading ? (
                        <Loader className="animate-spin w-5 h-5 text-white" />
                     ) : (
                        <>
                           { isSignUp ? <UserPlus size={ 16 } /> : <LogIn size={ 16 } /> }
                           { isSignUp ? "Create Account" : "Login" }
                        </>
                     ) }
                  </button>
               </form>

               <p className="text-sm text-zinc-400 text-center mt-6">
                  { isSignUp ? "Already have an account?" : "Don't have an account?" }{ " " }
                  <button
                     onClick={ toggleMode }
                     className="text-purple-400 hover:underline font-medium cursor-pointer"
                  >
                     { isSignUp ? "Sign In" : "Sign Up" }
                  </button>
               </p>
            </div>
         </div>
      </div>
   );
};

export default Login;
