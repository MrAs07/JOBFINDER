import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl font-medium text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
