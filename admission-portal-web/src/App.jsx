// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import './App.css';

export default function App() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [navSearch, setNavSearch] = useState('');

  const handleGlobalSearch = (query) => {
    console.log('Nav search trigger:', query);
    // Propagate or redirect to directory page
  };

  return (
    <div className="app-shell">
      <Navbar
        wishlistCount={wishlistCount}
        navSearch={navSearch}
        setNavSearch={setNavSearch}
        onSearchSubmit={handleGlobalSearch}
      />
      <main className="main-content">
        <HomePage onWishlistUpdate={(count) => setWishlistCount(count)} />
      </main>
      <Footer />
    </div>
  );
}