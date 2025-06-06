import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AllPosts from './pages/AllPosts';
import EditPost from './pages/EditPost';
import AdminCommentsList from './pages/AdminCommentsList';


const App = () => {
   const { adminToken } = useContext(AdminContext);

   return adminToken ? (
      <div>
         <ToastContainer theme='dark' />
         <Navbar />
         <Routes>
            <Route path='/' element={ <Dashboard /> } />
            <Route path='/create-post' element={ <CreatePost /> } />
            <Route path='/all-posts' element={ <AllPosts /> } />
            <Route path='/manage-comments' element={ <AdminCommentsList /> } />
            <Route path='/admin/edit/:id' element={ <EditPost /> } />
         </Routes>
      </div>
   ) : (
      <>
         <Login />
         <ToastContainer theme='dark' />
      </>
   );
};

export default App;
