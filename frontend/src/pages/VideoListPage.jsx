import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useVideoStore from '../store/videoStore';
import axios from 'axios';
import { FaTrashAlt, FaPlayCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoListPage = () => {
  const { interviewId } = useParams();
  const fetchPersonalFormsByInterview = useVideoStore((state) => state.fetchPersonalFormsByInterview);
  const getVideoUrl = useVideoStore((state) => state.getVideoUrl);
  const deleteUserAndVideo = useVideoStore((state) => state.deleteUserAndVideo);
  const personalForms = useVideoStore((state) => state.personalForms);
  const error = useVideoStore((state) => state.error);
  const isFetching = useVideoStore((state) => state.isFetching);
  const [videos, setVideos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPassed, setIsPassed] = useState(null);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const videoRef = useRef(null);

  // Fetch interview questions
  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      try {
        const response = await axios.get(`https://remotetech.onrender.com/api/interviews/${interviewId}/questions`);
        setQuestions(response.data);
      } catch (err) {
        console.error('Error fetching interview questions:', err);
      }
    };
    if (interviewId) {
      fetchInterviewQuestions();
    }
  }, [interviewId]);

  // Fetch personal forms and videos
  useEffect(() => {
    if (interviewId) {
      fetchPersonalFormsByInterview(interviewId);
    }
  }, [interviewId, fetchPersonalFormsByInterview]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videoData = await Promise.all(
        personalForms.map(async (user) => {
          const videoUrl = await getVideoUrl(user.videoId);
          return { ...user, videoUrl };
        })
      );
      setVideos(videoData);
    };
    if (personalForms.length > 0) {
      fetchVideos();
    }
  }, [personalForms, getVideoUrl]);

  // Fetch question times for the selected user
  useEffect(() => {
    const fetchQuestionTimes = async () => {
      if (!selectedUser) return;

      try {
        const response = await axios.get(
          `https://remotetech.onrender.com/api/interviews/${interviewId}/users/${selectedUser._id}/question-times`
        );
        setQuestionTimes(response.data);
      } catch (error) {
        console.error("Error fetching question times:", error);
      }
    };

    fetchQuestionTimes();
  }, [selectedUser, interviewId]);

  // Handle delete user and video
  const handleDelete = async (userId, videoId) => {
    const isConfirmed = window.confirm('Bu kullanıcıyı ve videosunu silmek istediğinize emin misiniz?');
    if (isConfirmed) {
      try {
        await deleteUserAndVideo(userId, videoId, interviewId);
        setVideos((prevVideos) => prevVideos.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user or video:", error);
        toast.error("Kullanıcı veya video silinirken hata oluştu.");
      }
    }
  };

  // Handle opening video modal
  const handleVideoClick = (videoUrl, user) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedUser(user);
    setIsPassed(user.status === 'Passed');
    setNotes(user.notes || '');
    setIsModalOpen(true);
  };

  // Handle jump to specific question time
  const handleJumpToQuestion = (startTime) => {
    if (videoRef.current && questionTimes.length > 0) {
      const startInSeconds = (new Date(startTime) - new Date(questionTimes[0].startTime)) / 1000;
      videoRef.current.currentTime = startInSeconds;
    }
  };

  // Handle save changes in modal
  const handleSave = async () => {
    try {
      await axios.put(`https://remotetech.onrender.com/api/users/${selectedUser._id}`, {
        notes,
        status: isPassed ? 'Passed' : 'Failed'
      });
      toast.success('Değişiklikler başarıyla kaydedildi!');
      fetchPersonalFormsByInterview(interviewId);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Değişiklikler kaydedilirken hata oluştu.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideoUrl('');
  };

  // Filtered videos based on search term
  const filteredVideos = videos.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching) return <p className="text-[#142147]">Loading personal forms...</p>;
  if (error) return <p className="text-[#142147]">Error: {error}</p>;
  if (videos.length === 0) return <p className="text-[#142147]">No videos found for this interview.</p>;

  return (
    <div className="container mx-auto ml-28 p-6">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold mb-8 text-[#142147] text-center">Personal Forms and Videos</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredVideos.map((user) => (
          <div key={user._id} className="bg-[#fafafa] p-6 rounded-xl shadow-lg border relative">
            {/* Name and alert icon container */}
            <div className="flex items-center gap-2 mb-4">
              {user.alert && (
                <FaExclamationCircle 
                  className="text-red-600" 
                  size={20} 
                  title="Bu kullanıcı başka bir sekmeye geçti!"
                />
              )}
              <h3 className="text-lg font-semibold text-[#142147]">
                {user.firstName} {user.lastName}
              </h3>
            </div>
            <div
              className={`absolute top-3 left-3 w-3 h-3 rounded-full ${
                user.status === null ? 'bg-blue-800' : user.status === 'Passed' ? 'bg-green-600' : 'bg-red-600'
              }`}
              title={user.status === 'Passed' ? 'Passed' : user.status === 'Failed' ? 'Failed' : 'Pending'}
            ></div>

            <FaTrashAlt
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer"
              onClick={() => handleDelete(user._id, user.videoId)}
              title="Delete Video"
            />

            {user.videoUrl ? (
              <div onClick={() => handleVideoClick(user.videoUrl, user)} className="relative cursor-pointer rounded-lg overflow-hidden">
                <FaPlayCircle className="absolute inset-0 m-auto text-white text-6xl opacity-90 z-10 pointer-events-none" />
                <video controls={false} width="100%" className="rounded-lg" onPlay={(e) => e.target.pause()}>
                  <source src={user.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p className="text-[#142147]">No video found for this user.</p>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-16 right-4 p-4 bg-white shadow-lg rounded-lg border border-gray-300 w-40">
        <h4 className="text-sm font-semibold text-[#142147] mb-2">Legend</h4>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-800 mr-2"></div>
          <span className="text-xs text-[#142147]">Pending</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
          <span className="text-xs text-[#142147]">Passed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
          <span className="text-xs text-[#142147]">Failed</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#ecf2f8] rounded-lg shadow-lg w-full max-w-6xl p-6 relative flex">
            <button className="absolute top-2 right-2 text-[#142147]" onClick={closeModal}>
              <FaTimes size={30} />
            </button>
            <div className="w-3/4 pr-4">
              <video ref={videoRef} controls width="100%" className="rounded-lg">
                <source src={selectedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="w-1/4 flex flex-col justify-between">
              <div className="mb-4">
                <div className="bg-[#8E9FBB] p-2 rounded w-24 mx-auto shadow-md">
                  <h3 className="font-semibold text-[#142147] text-sm text-center">Questions</h3>
                </div>
                <div className="text-[#142147] mt-4 space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                  {questions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      onClick={() => handleJumpToQuestion(questionTimes[qIndex]?.startTime)}
                      className="bg-[#fafafa] p-4 rounded-md shadow-md border border-gray-300 cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-[#142147]">Question {qIndex + 1}</p>
                      <p className="text-[#142147]">{question.questionText}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <h3 className="font-semibold text-[#142147]">Notes</h3>
                <textarea
                  className="w-full h-32 border rounded p-2 mt-2 text-[#142147] bg-[#fafafa] resize-none shadow-sm"
                  placeholder="Add your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex border border-[#8E9FBB] rounded-md overflow-hidden">
                  <button onClick={() => setIsPassed(true)} className={`w-16 py-2 text-white ${isPassed ? 'bg-green-600' : 'bg-gray-400'}`}>Passed</button>
                  <div className="w-0.5 bg-[#8E9FBB]" />
                  <button onClick={() => setIsPassed(false)} className={`w-16 py-2 text-white ${!isPassed ? 'bg-red-600' : 'bg-gray-400'}`}>Failed</button>
                </div>
                <button className="bg-[#8E9FBB] text-[#142147] w-24 py-2 rounded-md shadow-lg ml-2" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoListPage;
