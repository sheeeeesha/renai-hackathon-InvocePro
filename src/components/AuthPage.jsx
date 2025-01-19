// components/AuthPage.jsx

'use client';  // Ensures this component is client-side only

import React from 'react';

const AuthPage = () => {
  const handleAuthClick = () => {
    window.location.href = 'http://localhost:5000/auth'; // Trigger the OAuth flow
  };

  return (
    <div>
      <h1>Authenticate</h1>
      <button onClick={handleAuthClick}>Authenticate</button>
    </div>
  );
};

export default AuthPage;
