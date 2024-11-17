// InterviewList.js
import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { FaPlus } from 'react-icons/fa6';
import { FiLink, FiEdit } from 'react-icons/fi'; // FiEdit ikonu eklendi
import { BsQuestionSquare } from 'react-icons/bs';
import { GiWorld } from 'react-icons/gi';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import CreateInterview from './CreateInterview';
import useInterviewStore from '../store/Interviews';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InterviewList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const fetchInterviews = useInterviewStore((state) => state.fetchInterviews);
  const deleteInterview = useInterviewStore((state) => state.deleteInterview);
  const interviews = useInterviewStore((state) => state.interviews);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleDeleteInterview = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this interview?');
    if (isConfirmed) {
      deleteInterview(id);
      toast.success('Interview deleted successfully!');
    }
  };

  const handleShowQuestions = (questions) => {
    setSelectedQuestions(questions);
  };

  const handleToggleSelectInterview = (id) => {
    setSelectedInterviews((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((interviewId) => interviewId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelectedInterviews = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete the selected interviews?');
    if (isConfirmed) {
      selectedInterviews.forEach((id) => deleteInterview(id));
      setSelectedInterviews([]);
      setShowDeleteButton(false);
      setSelectionMode(false);
      toast.success('Selected interviews deleted successfully!');
    }
  };

  const generateInterviewLink = (interviewId) => {
    console.log("Generated Link:", `${import.meta.env.VITE_USER_URL}/user-form/${interviewId}`);
    return `${import.meta.env.VITE_USER_URL}/user-form/${interviewId}`;
  };
  
  const handleCopyLink = (interview) => {
    const link = generateInterviewLink(interview._id);
    navigator.clipboard.writeText(link)
      .then(() => toast.success('Interview link copied to clipboard!'))
      .catch((error) => toast.error('Failed to copy link:', error));
  };

  const handleEditInterview = (interview) => {
    setSelectedInterview(interview); // Düzenlenecek mülakatı seçiyoruz
    setIsModalOpen(true); // Modal açılıyor
  };

  const handleOpenInterview = (interview) => {
    navigate(`/see-videos/${interview._id}`);
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTbTrashClick = () => {
    if (selectionMode) {
      setSelectedInterviews([]);
      setSelectionMode(false);
    } else {
      setSelectionMode(true);
    }
    setShowDeleteButton(!showDeleteButton);
  };

  // Close the popup on outside click
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setSelectedQuestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 pl-24 md:pl-40 lg:pl-56 relative">
      <ToastContainer />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-[#142147] font-bold">Interview List</h1>

        <div className="flex items-center space-x-4">
          {showDeleteButton && (
            <button
              onClick={handleDeleteSelectedInterviews}
              className="px-3 py-1 bg-[#142147] text-white rounded-lg hover:bg-red-600"
            >
              Delete ({selectedInterviews.length})
            </button>
          )}

          <div className="relative group">
            <button
              onClick={handleTbTrashClick}
              className="w-8 h-8 flex items-center justify-center transition-colors"
            >
              <TbTrash
                className="text-[#142147] hover:text-red-600 transition-colors duration-200 cursor-pointer"
                size={28}
              />
            </button>

            <span
              className="absolute bottom-full mb-1 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#142147] text-white text-xs"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
            >
              Bulk Delete
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-[#142147]"></span>
            </span>
          </div>

          <input
            type="text"
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300 hover:text-[#8E9FBB] hover:border-[#8E9FBB]"
          />

          <button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedInterview(null); // Yeni mülakat eklemek için temizliyoruz
            }}
            className="group w-10 h-10 flex items-center justify-center text-2xl text-[#142147] hover:scale-110 transition-transform"
          >
            <FaPlus size={27} />
            <span
              className="absolute bottom-full mb-1 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#142147] text-white text-xs"
            >
              Add Interview
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-[#142147]"></span>
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => {
            const isPublished = new Date(interview.expireDate) > new Date();
            const isSelected = selectedInterviews.includes(interview._id);
            return (
              <div
                key={interview._id}
                onClick={() => selectionMode && handleToggleSelectInterview(interview._id)}
                className={`p-4 border-t-4 rounded-lg shadow-md relative bg-[#fafafa] w-[255px] h-80 flex flex-col justify-between transition-colors duration-200 cursor-pointer ${
                  isSelected ? 'bg-[#ecf2f8] border-[1px] border-[#8E9FBB]' : selectionMode ? 'hover:bg-[#ecf2f8]' : ''
                } ${isPublished ? 'border-[#142147]' : ''}`}
                 >
                <div className="flex items-center justify-between mb-2">
                  <BsQuestionSquare
                    className="text-gray-500 hover:text-blue-600 cursor-pointer text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowQuestions(interview.packages);
                    }}
                  />
                  <div className="flex items-center space-x-1 relative">
                    <FiEdit
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditInterview(interview);
                      }}
                      className="text-gray-500 hover:text-blue-600 cursor-pointer"
                    />
                    <FiLink
                      onMouseEnter={() => setShowTooltip(interview._id)}
                      onMouseLeave={() => setShowTooltip(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(interview);
                      }}
                      className="text-gray-500 hover:text-blue-600 cursor-pointer"
                    />
                    {showTooltip === interview._id && (
                      <span className="absolute bottom-full mb-2 left-[25%] transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1">
                        Copy link
                        <span className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-black"></span>
                      </span>
                    )}
                    <HiOutlineTrash
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInterview(interview._id);
                      }}
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                    />
                  </div>
                </div>

                <h2 className="text-lg font-bold mb-1 text-[#142147] leading-snug">{interview.title}</h2>

                <div className="bg-[#ced9e7] p-4 rounded-md mb-2 h-24 flex items-center justify-around shadow-md">
                  <div className="text-center border-l-2 border-gray-400 pl-1">
                    <p className="text-sm font-medium text-gray-600">TOTAL</p>
                    <p className="text-2xl font-bold text-[#142147]">{interview.totalVideos || 0}</p>
                  </div>
                  <div className="text-center border-l-2 border-gray-400 pl-1">
                    <p className="text-sm font-medium text-gray-600">ON HOLD</p>
                    <p className="text-2xl font-bold text-[#142147]">{interview.onHold || 0}</p>
                  </div>
                </div>

                <div>
                  <hr className="mb-2 border-gray-300" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 leading-snug flex items-center">
                      <GiWorld className="mr-1" /> {isPublished ? 'Published' : 'Unpublished'}
                    </p>
                    <button
                      onClick={() => handleOpenInterview(interview)}
                      className="text-sm font-medium text-gray-500 hover:text-[#142147] leading-snug"
                    >
                      See Videos &gt;
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-[#142147] mt-6">No interviews found.</p>
        )}
      </div>

      <CreateInterview 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchInterviews}
        interviewToEdit={selectedInterview} // Düzenlenecek mülakat bilgisi gönderiliyor
      />

      {selectedQuestions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div ref={popupRef} className="bg-white rounded-lg shadow-lg w-[95%] sm:w-[400px] relative">
            <div className="flex justify-between items-center mb-4 p-4 rounded-t-lg" style={{ backgroundColor: '#8E9FBB' }}>
              <h3 className="text-xl font-bold text-[#142147]">Interview Questions</h3>
              <button
                onClick={() => setSelectedQuestions([])}
                className="text-[#142147] hover:text-gray-200 text-xl"
              >
                X
              </button>
            </div>

            <div className="p-8">
              {selectedQuestions.map((pkg, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">{pkg.packageName}</h4>
                  <ul className="list-disc ml-6">
                    {pkg.questions.map((question, i) => (
                      <li key={i} className="text-gray-700">{question.questionText}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewList;