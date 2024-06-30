// EditButton.js
import React from 'react';

export const EditButton = ({ onClick }) => {
  return (
    <button className="bg-orange-500 hover:bg-orange-700 shadow-md text-white font-bold py-2 px-4 rounded ml-4" onClick={onClick}>Edit</button>
  );
};

