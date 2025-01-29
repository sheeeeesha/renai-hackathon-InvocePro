import React from 'react';
import { Download } from 'lucide-react';

const PDFComponent = ({ filename, fileUrl }) => {
  // Truncate filename to the first 20 characters (you can adjust the limit as needed)
  const truncatedFilename = filename.length > 20 ? filename.slice(0, 20) + '...' : filename;

  return (
    <div className="flex flex-col items-center bg-black p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xs font-semibold font-exo text-white mb-2 text-ellipsis overflow-hidden max-w-[200px]">{truncatedFilename}</h3>
      <a href={fileUrl} download>
        <button className=" flex items-center justify-center bg-white text-black text-xs font-semibold font-exo px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-4">
          <span><Download className='h-7 w-7'/></span>
          Download PDF
        </button>
      </a>
    </div>
  );
};

export default PDFComponent;
