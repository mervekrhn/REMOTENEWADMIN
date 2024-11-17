import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi';
import { FaPlus } from 'react-icons/fa6';
import { TbTrash } from 'react-icons/tb'; // TbTrash butonu eklendi
import usePackageStore from '../store/Packages';

const ManagePackages = () => {
  const { packages, fetchPackages, deletePackage } = usePackageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]); // Seçilen paketler
  const [showDeleteButton, setShowDeleteButton] = useState(false); // Toplu silme butonunun görünürlüğü
  const [selectionMode, setSelectionMode] = useState(false); // Seçim modunu kontrol eder

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Bu paketi silmek istediğinizden emin misiniz?');
    if (isConfirmed) {
      deletePackage(id);
    }
  };

  const handleToggleSelectPackage = (id) => {
    setSelectedPackages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pkgId) => pkgId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelectedPackages = () => {
    const isConfirmed = window.confirm('Seçilen paketleri silmek istediğinizden emin misiniz?');
    if (isConfirmed) {
      selectedPackages.forEach((id) => deletePackage(id));
      setSelectedPackages([]); // Seçim listesini temizle
      setSelectionMode(false); // Seçim modunu kapat
      setShowDeleteButton(false); // "Delete Selected" butonunu gizle
    }
  };

  const handleTbTrashClick = () => {
    if (selectionMode) {
      setSelectedPackages([]); // Seçilen paketleri sıfırla
      setSelectionMode(false);   // Seçim modunu kapat
    } else {
      setSelectionMode(true);    // Seçim modunu aç
    }
    setShowDeleteButton(!showDeleteButton); // Delete Selected butonunu göster/gizle
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-[270px] p-6 max-w-full lg:max-w-[1000px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-1xl font-bold text-left text-[#142147]">
          Manage Question Packages
        </h1>
        <div className="flex items-center space-x-2">
          {/* Eğer TbTrash'a tıklandıysa "Delete Selected" butonu solunda görünür olur */}
          {showDeleteButton && (
            <button
              onClick={handleDeleteSelectedPackages}
              className="px-3 py-1 bg-[#142147] text-white rounded-lg hover:bg-red-600"
            >
              Delete ({selectedPackages.length})
            </button>
          )}

          {/* TbTrash Icon Button with Tooltip */}
          <div className="relative group">
            <button
              onClick={handleTbTrashClick} // TbTrash'a tıklayınca seçim modunu aç/kapat
              className="w-8 h-8 flex items-center justify-center transition-colors"
            >
              <TbTrash
                className="text-[#142147] hover:text-red-600 transition-colors duration-200 cursor-pointer"
                size={28}
              />
            </button>

            {/* Tooltip */}
            <span
              className="absolute bottom-full mb-1 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#142147] text-white text-xs"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
            >
              Bulk delete
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-[#142147]"></span>
            </span>
          </div>

          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300 hover:text-[#8E9FBB] hover:border-[#8E9FBB] w-full max-w-[200px]"
          />

          <Link
            to="/create-package"
            className="relative group w-10 h-10 flex items-center justify-center text-2xl hover:scale-110 transition-transform text-[#142147]"
          >
            <FaPlus size={27} />
            <span
              className="absolute bottom-full mb-1 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#142147] text-white text-xs"
            >
              Create Package
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-[#142147]"></span>
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[40px,3fr,2fr,1fr] uppercase text-sm font-semibold h-10 px-6 rounded-lg shadow-md text-[#142147] bg-[#8E9FBB] w-full max-w-full">
        <div className="flex items-center text-left pl-1 relative border-r-2 h-8 mt-1 border-[#fafafa]">#</div>
        <div className="flex items-center text-left pl-4 relative border-r-2 h-8 mt-1 border-[#fafafa]">Package Name</div>
        <div className="flex justify-center items-center relative border-r-2 h-8 mt-1 border-[#fafafa]">Question Count</div>
        <div className="flex items-center justify-center">Actions</div>
      </div>

      <div className="space-y-4 mt-4 w-full max-w-full">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg, index) => {
            const isSelected = selectedPackages.includes(pkg._id);
            return (
              <div
                key={pkg._id}
                onClick={() => selectionMode && handleToggleSelectPackage(pkg._id)} // Seçim modundayken kartlara tıklanabilir
                className={`grid grid-cols-[40px,3fr,2fr,1fr] items-center shadow-md rounded-lg px-4 h-[60px] text-[#142147] bg-[#fafafa] w-full max-w-full transition-colors duration-200 cursor-pointer ${
                  isSelected ? 'bg-[#ecf2f8] border-[1px] border-[#8E9FBB]' : 'hover:bg-[#ecf2f8]'
                }`}
              >
               <div className="text-lg font-semibold text-left pl-2 relative h-10 flex items-center after:absolute after:left-11 after:h-full after:w-[2px] after:bg-[#8E9FBB]">
  {index + 1}
</div>
<div className="text-lg font-semibold text-left pl-4 relative h-10 flex items-center after:absolute after:right-0 after:h-full after:w-[2px] after:bg-[#8E9FBB]">
  {pkg.packageName}
</div>
<div className="text-lg font-semibold flex justify-center items-center relative h-10 after:absolute after:right-1 after:h-full after:w-[2px] after:bg-[#8E9FBB]">
  {pkg.questions.length}
</div>

                <div className="flex justify-center space-x-4 h-full items-center">
                  <Link
                    to={`/create-package?edit=true&id=${pkg._id}`}
                    className="text-[#142147] hover:text-blue-700"
                  >
                    <FaEdit className="text-xl" />
                  </Link>

                  <button
                    className="text-[#142147] hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Seçim yapılırken silme işlemini devre dışı bırakmak için
                      handleDelete(pkg._id);
                    }}
                  >
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-[#142147] mt-6">No packages found.</p>
        )}
      </div>
    </div>
  );
};

export default ManagePackages;