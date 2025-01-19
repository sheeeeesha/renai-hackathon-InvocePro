// components/AuthPage.jsx

'use client';  // Ensures this component is client-side only

import React from 'react';

const AuthPage = () => {
  const handleAuthClick = () => {
    window.location.href = 'http://localhost:5000/auth'; // Trigger the OAuth flow
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Authenticate</h1>
        <p className="text-center text-gray-500 mb-4">Please click the button below to authenticate with the application.</p>
        <div className="flex justify-center">
          <button
            onClick={handleAuthClick}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
