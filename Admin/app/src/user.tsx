import React from 'react';
import adminImage from './assets/adminImage.jpg'; // Adjust the path as needed

export const User = () => {
  return (
    <div className="flex items-center justify-end pr-5 pt-3 m-6">
      <img src={adminImage} alt="admin" className="w-12 h-12 rounded-full mr-3" />
      <div className="flex flex-col items-end">
        <span className="text-lg font-bold">Name</span>
        <span className="text-sm font-semibold text-gray-600">Admin</span>
      </div>
    </div>
  );
};
