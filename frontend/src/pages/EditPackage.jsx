import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import usePackageStore from '../store/Packages';

const EditPackage = () => {
  const { id } = useParams();
  const { packages, updatePackage, fetchPackages } = usePackageStore();

  const [packageName, setPackageName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(2);
  const [timeSeconds, setTimeSeconds] = useState(0);

  useEffect(() => {
    const loadPackage = async () => {
      await fetchPackages();
      const pkg = packages.find((pkg) => pkg._id === id);
      if (pkg) {
        setPackageName(pkg.packageName);
        setQuestions(pkg.questions);
      }
      setIsLoading(false);
    };
    loadPackage();
  }, [id, fetchPackages]);

  // Otomatik kaydetmek için useEffect ekliyoruz
  useEffect(() => {
    if (!isLoading) {
      const updatedPackage = { packageName, questions };
      updatePackage(id, updatedPackage);
    }
  }, [packageName, questions, updatePackage, id, isLoading]);

  const handleAddQuestion = () => {
    if (newQuestion.trim() && (timeMinutes > 0 || timeSeconds > 0)) {
      const newQ = {
        questionText: newQuestion,
        question_time: { minutes: timeMinutes, seconds: timeSeconds },
      };
      setQuestions([...questions, newQ]);
      setNewQuestion('');
      setTimeMinutes(2);
      setTimeSeconds(0);
      setIsModalOpen(false);
    } else {
      alert('Lütfen geçerli bir soru ve zaman girin.');
    }
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'minutes' || field === 'seconds') {
      updatedQuestions[index].question_time[field] = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((q) => q._id === active.id);
        const newIndex = items.findIndex((q) => q._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (isLoading) {
    return <div className="ml-[270px] p-6">Loading...</div>;
  }

  return (
    <div className="ml-[270px] p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Package</h1>
      <input
        type="text"
        placeholder="Package Name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
        className="border px-4 py-2 mb-4 w-full rounded"
      />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions} strategy={verticalListSortingStrategy}>
          <table className="w-full bg-white shadow-md rounded-lg mb-6">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Drag</th>
                <th className="py-3 px-6">Order</th>
                <th className="py-3 px-6">Question</th>
                <th className="py-3 px-6">Time (Minutes:Seconds)</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <SortableItem
                  key={q._id || index}
                  id={q._id}
                  index={index}
                  question={q}
                  handleQuestionChange={handleQuestionChange}
                  handleDeleteQuestion={handleDeleteQuestion}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Question
      </button>

      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4">Add Question</h3>
            <textarea
              placeholder="Question Text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="border px-4 py-2 mb-4 w-full rounded"
              rows={3}
            />
            <div className="flex space-x-2 mb-4">
              <input
                type="number"
                placeholder="Minutes"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                className="border px-4 py-2 w-full rounded"
              />
              <input
                type="number"
                placeholder="Seconds"
                value={timeSeconds}
                onChange={(e) => setTimeSeconds(e.target.value)}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SortableItem = ({ id, index, question, handleQuestionChange, handleDeleteQuestion }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td>
        {/* Drag Handle */}
        <span
          {...listeners}
          className="cursor-move text-gray-500 hover:text-gray-700"
        >
          &#9776;
        </span>
      </td>
      <td className="py-3 px-6">{index + 1}</td>
      <td>
        <input
          type="text"
          value={question.questionText}
          onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
      </td>
      <td>
        <div className="flex space-x-2">
          <input
            type="number"
            value={question.question_time.minutes}
            onChange={(e) => handleQuestionChange(index, 'minutes', parseInt(e.target.value))}
            className="border px-2 py-1 rounded w-12"
          />
          :
          <input
            type="number"
            value={question.question_time.seconds}
            onChange={(e) => handleQuestionChange(index, 'seconds', parseInt(e.target.value))}
            className="border px-2 py-1 rounded w-12"
          />
        </div>
      </td>
      <td>
        <button
          onClick={() => handleDeleteQuestion(index)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default EditPackage;
