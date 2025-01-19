// components/Home.jsx

import Link from 'next/link';

const Home = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to InvoicePro</h1>
      <p className="text-xl text-gray-600 mb-8">Please click below to get started.</p>
      <Link
        href="/auth"
        className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-300"
      >
        Go to Authenticate
      </Link>
    </div>
  </div>
);

export default Home;
