import React from 'react';

const PDFComponent = ({ filename, fileUrl }) => {
  // Truncate filename to the first 20 characters (you can adjust the limit as needed)
  const truncatedFilename = filename.length > 20 ? filename.slice(0, 20) + '...' : filename;

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xs font-semibold text-purple-800 mb-2 text-ellipsis overflow-hidden max-w-[200px]">{truncatedFilename}</h3>
      <a href={fileUrl} download>
        <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-4">
          Download PDF
        </button>
      </a>
    </div>
  );
};

export default PDFComponent;
