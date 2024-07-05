// Edit.js
import React, { useState } from 'react';

const Edit = ({ onClose, onSubmit }) => {
  const [newUsername, setNewUsername] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ newUsername });
  };

  return (
    <div
      className="fixed top-0 left-0 w-full bg-gray-500 bg-opacity-70 flex items-center h-full"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded shadow-md p-4 max-w-md mx-auto mt-20 ">
        <h2 className="text-lg font-bold mb-4">Edit Username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter new username"
            className="w-full p-2 pl-10 text-sm text-gray-700 mb-6"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;