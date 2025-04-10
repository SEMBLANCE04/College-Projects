import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SearchModal from '../common/SearchModal';
import { closeSidebar } from '../../redux/features/ui/uiSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, searchModalOpen } = useSelector((state) => state.ui);

  // Close sidebar on route change
  useEffect(() => {
    if (sidebarOpen) {
      dispatch(closeSidebar());
    }
  }, [dispatch, sidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Mobile Sidebar */}
      {sidebarOpen && <Sidebar />}
      
      {/* Search Modal */}
      {searchModalOpen && <SearchModal />}
    </div>
  );
};

export default Layout;
