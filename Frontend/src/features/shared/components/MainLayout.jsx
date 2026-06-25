import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import CreatePostModal from '../../posts/components/CreatePostModal';

const MainLayout = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar onCreateClick={() => setIsCreateOpen(true)} />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomBar onCreateClick={() => setIsCreateOpen(true)} />
      
      {isCreateOpen && (
        <CreatePostModal onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};

export default MainLayout;
