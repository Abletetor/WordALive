import { Mail, Github, Linkedin, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
   return (
      <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-10 px-6 md:px-10 border-t border-zinc-800">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand Info */ }
            <div>
               <h2 className="text-2xl font-bold text-purple-500 mb-3">WordALive</h2>
               <p className="text-sm mb-4">
                  Faith-filled reflections, Spirit-led insights, and devotionals to strengthen your walk with Christ.
               </p>
               <div className="flex gap-4 mt-4">
                  <a href="#" target="_blank" rel="noreferrer">
                     <Github size={ 20 } className="hover:text-purple-500 transition" />
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                     <Linkedin size={ 20 } className="hover:text-purple-500 transition" />
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                     <Twitter size={ 20 } className="hover:text-purple-500 transition" />
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                     <Facebook size={ 20 } className="hover:text-purple-500 transition" />
                  </a>
               </div>
            </div>

            {/* Quick Links */ }
            <div>
               <h4 className="text-white font-semibold mb-3">Quick Links</h4>
               <ul className="space-y-2 text-sm">
                  <li><Link to="/" onClick={ () => scrollTo(0, 0) } className="hover:text-purple-500 transition">Home</Link></li>
                  <li><Link to="/about" onClick={ () => scrollTo(0, 0) } className="hover:text-purple-500 transition">About</Link></li>
               </ul>
            </div>

            {/* Categories */ }
            <div>
               <h4 className="text-white font-semibold mb-3">Categories</h4>
               <ul className="space-y-2 text-sm">
                  <li><Link onClick={ () => scrollTo(0, 0) } to="/" className="hover:text-purple-500 transition">Faith</Link></li>
                  <li><Link onClick={ () => scrollTo(0, 0) } to="/" className="hover:text-purple-500 transition">Prayer</Link></li>
                  <li><Link onClick={ () => scrollTo(0, 0) } to="/" className="hover:text-purple-500 transition">Healing</Link></li>
                  <li><Link onClick={ () => scrollTo(0, 0) } to="/" className="hover:text-purple-500 transition">Growth</Link></li>
                  <li><Link onClick={ () => scrollTo(0, 0) } to="/" className="hover:text-purple-500 transition">Prosperity</Link></li>
                  <li><Link onClick={ () => scrollTo(0, 0) } to="" className="hover:text-purple-500 transition">Salvation</Link></li>
               </ul>
            </div>

            {/* Newsletter */ }
            <div>
               <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
               <p className="text-sm mb-3">Subscribe & Receive daily devotionals and inspiration straight to your inbox.</p>
               <form className="flex gap-2 mt-2">
                  <input
                     type="email"
                     placeholder="you@example.com"
                     className="bg-zinc-800 text-white text-sm px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md">
                     <Mail size={ 16 } />
                  </button>
               </form>
            </div>
         </div>

         {/* Footer Bottom */ }
         <div className="text-xs text-zinc-500 text-center mt-10 border-t border-zinc-800 pt-6">
            &copy; { new Date().getFullYear() } WordALive. All rights reserved.
         </div>
      </footer>
   );
};

export default Footer;
