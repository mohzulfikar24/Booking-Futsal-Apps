import React from 'react';
import Navbar from './parents/Navbar';
import Footer from './parents/Footer';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className='' style={{ height: '100%' }}>
      <div style={{ height: '20%' }}>
        <Navbar />
      </div>
      <div style={{ height: '70%' }}>
        <Outlet />
      </div>
      <div style={{ height: '10%' }}>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
