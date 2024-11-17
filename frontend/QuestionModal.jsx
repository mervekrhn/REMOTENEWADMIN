import React, { useState } from 'react';

const QuestionModal = ({ isOpen, onClose, addQuestion }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionTime, setQuestionTime] = useState('');

  const handleAddQuestion = () => {
    addQuestion({ question: questionText, time: questionTime });
    setQuestionText('');
    setQuestionTime('');
    onClose(); // Close the modal after adding the question
  };

  if (!isOpen) return null; // Don't render the modal if it isn't open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Add Question</h2>
        <div className="mb-4">
          <label className="block text-sm mb-2">Question</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="border px-4 py-2 w-full rounded"
            placeholder="Enter your question..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Time (minutes)</label>
          <input
            type="number"
            value={questionTime}
            onChange={(e) => setQuestionTime(e.target.value)}
            className="border px-4 py-2 w-full rounded"
            placeholder="Enter time..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
