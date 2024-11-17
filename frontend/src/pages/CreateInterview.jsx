import React, { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import usePackageStore from '../store/Packages';
import useInterviewStore from '../store/Interviews';
import { toast } from 'react-toastify';

const CreateInterview = ({ isOpen, onClose, onSuccess, interviewToEdit }) => {
  const { packages, fetchPackages } = usePackageStore();
  const addInterview = useInterviewStore((state) => state.addInterview);
  const updateInterview = useInterviewStore((state) => state.updateInterview);

  const [title, setTitle] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [expireDate, setExpireDate] = useState('');
  const [canSkip, setCanSkip] = useState(false);
  const [showAtOnce, setShowAtOnce] = useState(false);
  const [packageInput, setPackageInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    if (interviewToEdit) {
      setTitle(interviewToEdit.title || '');
      setSelectedPackages(interviewToEdit.packages || []);
      setExpireDate(
        interviewToEdit.expireDate
          ? new Date(interviewToEdit.expireDate).toISOString().split('T')[0]
          : ''
      );
      setCanSkip(interviewToEdit.canSkip || false);
      setShowAtOnce(interviewToEdit.showAtOnce || false);
    } else {
      resetForm();
    }
  }, [interviewToEdit]);

  const resetForm = () => {
    setTitle('');
    setSelectedPackages([]);
    setExpireDate('');
    setCanSkip(false);
    setShowAtOnce(false);
    setPackageInput('');
    setError('');
  };

  const handleAddPackage = (pkgName) => {
    const selectedPkg = packages.find((pkg) => pkg.packageName === pkgName);
    if (selectedPkg && !selectedPackages.some((p) => p._id === selectedPkg._id)) {
      setSelectedPackages([
        ...selectedPackages,
        { _id: selectedPkg._id, packageName: selectedPkg.packageName },
      ]);
      setPackageInput('');
    }
  };

  const handleRemovePackage = (pkg) => {
    setSelectedPackages(selectedPackages.filter((p) => p._id !== pkg._id));
  };

  const handleCreateOrUpdateInterview = async () => {
    if (!title || !expireDate || selectedPackages.length === 0) {
      setError('All fields are required. Please fill in all details.');
      return;
    }

    const interviewData = {
      title,
      packages: selectedPackages.map((pkg) => pkg._id),
      expireDate: new Date(expireDate),
      canSkip,
      showAtOnce,
    };

    try {
      if (interviewToEdit) {
        await updateInterview(interviewToEdit._id, interviewData);
        toast.success('Interview updated successfully!');
      } else {
        await addInterview(interviewData);
        toast.success('Interview added successfully!');
      }
      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating/updating interview:', error);
      toast.error('Failed to create/update interview');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-[800px] h-[480px]">
        <div
          className="flex justify-between items-center mb-4 p-4 rounded-t-lg"
          style={{ backgroundColor: '#8E9FBB' }}
        >
          <h3 className="text-lg font-bold text-[#142147]">
            {interviewToEdit ? 'Edit Interview' : 'Create Interview'}
          </h3>
          <button onClick={handleClose} className="text-[#142147] hover:text-gray-200 text-2xl">
            <HiOutlineX />
          </button>
        </div>

        <div className="mb-4 ml-8 mr-8">
          <label className="block mb-1 font-semibold text-[#142147]">Title</label>
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={20}
            className="border px-4 py-2 w-full rounded text-[#142147]"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {title.length}/20 characters
          </p>
        </div>

        <div className="mb-4 ml-8 mr-8">
          <label className="block mb-1 font-semibold text-[#142147]">Package</label>
          <select
            className="border px-4 py-2 w-full rounded mb-2 text-[#142147]"
            value={packageInput}
            onChange={(e) => {
              setPackageInput(e.target.value);
              handleAddPackage(e.target.value);
            }}
          >
            <option value="" className="text-[#142147]">
              Select Package
            </option>
            {packages.map((pkg, index) => (
              <option key={index} value={pkg.packageName} className="text-[#142147]">
                {pkg.packageName}
              </option>
            ))}
          </select>

          <div className="mt-2">
            {selectedPackages.map((pkg, index) => (
              <div
                key={index}
                className="inline-block bg-gray-200 px-2 py-1 rounded-lg mr-2 mb-2 text-[#142147]"
              >
                {pkg.packageName}
                <button
                  onClick={() => handleRemovePackage(pkg)}
                  className="ml-2 text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 ml-8 mr-8">
          <label className="block mb-1 font-semibold text-[#142147]">Expire Date</label>
          <input
            type="date"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            className="border px-4 py-2 w-full rounded text-[#142147]"
          />
        </div>

        <div className="flex justify-between items-center mb-4 mx-8">
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2">
              <label className="font-semibold text-[#142147]">Can Skip</label>
              <div
                className={`w-8 h-4 flex items-center rounded-full p-1 cursor-pointer ${
                  canSkip ? 'bg-[#142147]' : 'bg-gray-300'
                }`}
                onClick={() => setCanSkip(!canSkip)}
              >
                <div
                  className={`bg-white w-2.5 h-2.5 rounded-full shadow-md transform ${
                    canSkip ? 'translate-x-4' : ''
                  }`}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <label className="font-semibold text-[#142147]">Show At Once</label>
              <div
                className={`w-8 h-4 flex items-center rounded-full p-1 cursor-pointer ${
                  showAtOnce ? 'bg-[#142147]' : 'bg-gray-300'
                }`}
                onClick={() => setShowAtOnce(!showAtOnce)}
              >
                <div
                  className={`bg-white w-2.5 h-2.5 rounded-full shadow-md transform ${
                    showAtOnce ? 'translate-x-4' : ''
                  }`}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {error && <div className="text-red-500">{error}</div>}

            <button
              onClick={handleCreateOrUpdateInterview}
              className="bg-[#142147] text-white px-4 py-2 rounded hover:scale-105 transition-transform"
            >
              {interviewToEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
