'use client';

import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const GeneratePage = () => {
  const router = useRouter();

  const handleGenerateTable = () => {
    // Add your logic here to handle the table generation
    alert('Table Generation Logic Goes Here');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-blue-400">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <main className="w-full lg:w-3/5 p-16 bg-white rounded-lg shadow-xl">
          <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
            Generate Your Table
          </h2>

          <button
            onClick={handleGenerateTable} // Button click handler
            className="w-full sm:w-auto bg-green-600 text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-6"
          >
            Generate Table
          </button>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default GeneratePage;
