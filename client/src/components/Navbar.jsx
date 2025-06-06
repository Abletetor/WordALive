import { useContext, useState } from "react";
import { LogIn, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const navLinks = [
   { name: "Home", path: "/" },
   { name: "About", path: "/about" },
];


const Navbar = () => {
   const { userToken, setUserToken } = useContext(AppContext);
   const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();

   const logout = () => {
      localStorage.removeItem("userToken");
      setUserToken(null);
      navigate('/');
   };

   return (
      <nav className="bg-zinc-900 text-zinc-100 shadow-md sticky top-0 z-50">
         <div className="container mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
            {/* Brand */ }
            <Link
               to="/"
               className="text-2xl font-bold text-purple-400 tracking-tight"
            >
               WordALive
            </Link>

            <div className="flex items-center justify-between gap-4">
               {/* Desktop Links */ }
               <div className="hidden md:flex gap-8">
                  { navLinks.map((link) => (
                     <NavLink
                        key={ link.name }
                        to={ link.path }
                        className={ ({ isActive }) =>
                           `hover:text-purple-400 transition duration-200 font-medium ${isActive ? 'border-b-2 border-purple-400 text-purple-400' : ''
                           }`
                        }
                        onClick={ () => scrollTo(0, 0) }
                     >
                        { link.name }
                     </NavLink>
                  )) }
               </div>

               {/* Right: Auth + Mobile Menu */ }
               <div className="flex items-center gap-4">
                  {/* Login Button */ }
                  { userToken ?
                     <button
                        onClick={ () => {
                           logout();
                           scrollTo(0, 0);
                        } }
                        className="flex items-center gap-1 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:border-purple-400 hover:text-purple-400 transition">
                        <LogOut size={ 16 } />
                        Logout
                     </button> :
                     <Link
                        to='/login'
                        onClick={ () => scrollTo(0, 0) }
                        className="flex items-center gap-1 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:border-blue-400 hover:text-blue-400 transition">
                        <LogIn size={ 16 } />
                        Login
                     </Link>

                  }

                  {/* Hamburger - Mobile only */ }
                  <button
                     onClick={ () => setIsOpen(!isOpen) }
                     className="md:hidden text-zinc-100 focus:outline-none"
                  >
                     { isOpen ? <X size={ 24 } /> : <Menu size={ 24 } /> }
                  </button>
               </div>

            </div>
         </div>

         {/* Slide-In Mobile Menu from Right */ }
         <AnimatePresence>
            { isOpen && (
               <motion.div
                  key="mobileMenu"
                  initial={ { x: "100%" } }
                  animate={ { x: 0 } }
                  exit={ { x: "100%" } }
                  transition={ { type: "spring", stiffness: 300, damping: 30 } }
                  className="fixed top-0 right-0 w-64 h-screen bg-zinc-900 shadow-lg z-40 md:hidden flex flex-col px-6 pt-6 pb-8"
               >
                  {/* Close Icon */ }
                  <button
                     onClick={ () => setIsOpen(false) }
                     className="absolute top-4 right-4 text-zinc-400 hover:text-purple-400"
                  >
                     <X size={ 24 } />
                  </button>

                  {/* Mobile Links */ }
                  <div className="mt-12 flex flex-col gap-6">
                     { navLinks.map((link) => (
                        <NavLink
                           key={ link.name }
                           to={ link.path }
                           onClick={ () => setIsOpen(false) }
                           className="text-zinc-300 text-lg hover:text-purple-400 transition-colors"
                        >
                           { link.name }
                        </NavLink>
                     )) }
                  </div>
               </motion.div>
            ) }
         </AnimatePresence>
      </nav>
   );
};

export default Navbar;
