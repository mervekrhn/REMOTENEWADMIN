import React from 'react';
import { Link } from 'react-router-dom';
import { RxPencil2 } from "react-icons/rx";
import { BsPersonBoundingBox } from "react-icons/bs";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-[250px] bg-gray-100 text-black p-6 shadow-lg rounded-r-lg">
      <div className="mb-20 text-center">
        <h2 className="text-xl font-bold text-[#000F38]">Admin Panel</h2>
      </div>
      <nav className="space-y-4">
        <Link 
          to="/manage-packages" 
          className="block text-base font-medium text-[#142147] hover:text-black hover:bg-gray-300 px-2 py-2 rounded-md">
          <div className="flex items-center space-x-3">
            <RxPencil2 style={{ fontSize: '20px' }} />
            <span className="whitespace-nowrap">
              Manage Question <br /> Packages
            </span>
          </div>
        </Link>

        <Link 
          to="/interview-list" 
          className="block text-base font-medium text-[#142147] hover:text-black hover:bg-gray-300 px-2 py-2 rounded-md">
          <div className="flex items-center space-x-3">
            <BsPersonBoundingBox style={{ fontSize: '20px' }} />
            <span>Interview List</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
