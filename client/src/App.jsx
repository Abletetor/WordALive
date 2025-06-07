import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Footer from './components/Footer';
import Login from './pages/Login';
import About from './pages/About';
import SalvationPage from './pages/SalvationPage';
import SearchResults from './pages/SearchResults';

const App = () => {
   return (
      <div>
         <ToastContainer theme='dark' />
         <Navbar />
         <Routes>
            <Route path='/' element={ <Home /> } />
            <Route path="/posts/:slug" element={ <PostDetail /> } />
            <Route path='/login' element={ <Login /> } />
            <Route path='/about' element={ <About /> } />
            <Route path="/salvation" element={ <SalvationPage /> } />
            <Route path="/search" element={ <SearchResults /> } />
         </Routes>
         <Footer />
      </div>
   );
};

export default App;
