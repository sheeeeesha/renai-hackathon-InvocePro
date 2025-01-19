import React from 'react';

const ColumnForm = ({ columns, handleColumnChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <label htmlFor="gmail" className="text-gray-900 font-semibold mb-2">Gmail Address</label>
        <input
          type="email"
          name="gmail"
          id="gmail"
          value={columns.gmail}
          onChange={handleColumnChange}
          placeholder="Enter Gmail address"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="startDate" className="text-gray-900 font-semibold mb-2">Start Date</label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={columns.startDate}
          onChange={handleColumnChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="endDate" className="text-gray-900 font-semibold mb-2">End Date</label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={columns.endDate}
          onChange={handleColumnChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="keyword" className="text-gray-900 font-semibold mb-2">Keyword</label>
        <input
          type="text"
          name="keyword"
          id="keyword"
          value={columns.keyword}
          onChange={handleColumnChange}
          placeholder="Enter Keyword"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
        />
      </div>
    </div>
  );
};

export default ColumnForm;
