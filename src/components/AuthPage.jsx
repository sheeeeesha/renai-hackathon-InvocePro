// components/AuthPage.jsx

"use client"; // Ensures this component is client-side only
import Link from "next/link";
import React from "react";

const AuthPage = () => {
  const handleAuthClick = () => {
    window.location.href = "http://localhost:5000/auth"; // Trigger the OAuth flow
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-auth-bg bg-cover bg-center">
      <div className="relative bg-black bg-opacity-70 text-white rounded-2xl shadow-lg max-w-md w-full p-6">
        {/* Close Icon */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c.861 0 1.591.57 1.852 1.354a3.99 3.99 0 010 2.292C13.591 15.43 12.861 16 12 16c-.861 0-1.591-.57-1.852-1.354a3.99 3.99 0 010-2.292C10.409 11.57 11.139 11 12 11zm0 4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0-10a8.48 8.48 0 00-7.875 5h15.75A8.48 8.48 0 0012 5.5zm0 13a8.48 8.48 0 007.875-5H4.125A8.48 8.48 0 0012 18.5z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold font-exo mt-4">
          OAuth Client 2.0 Authentication
        </h2>
        <p className="text-center text-sm font-exo text-gray-400 mt-2">
          Enhance your security by setting up OAuthentication (OAuth2.0) using
          email verification. This is required to sign up and link your email
          account for seamless integration.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6 px-10">
          <Link href={"/"}>
            <button className="text-gray-400 hover:text-white">Cancel</button>
          </Link>
          <button
            className="px-6 py-3 text-white font-lexend rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
            onClick={handleAuthClick}
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
