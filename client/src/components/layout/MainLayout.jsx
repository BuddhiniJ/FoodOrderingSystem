import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
