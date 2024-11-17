import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import usePackageStore from '../store/Packages';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePackage = () => {
  const [packageName, setPackageName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(2);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const { addPackage, updatePackage, packages } = usePackageStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit');
  const packageId = searchParams.get('id');

  // Load package
  useEffect(() => {
    if (isEdit && packageId) {
      const pkg = packages.find((pkg) => pkg._id === packageId);
      if (pkg) {
        setPackageName(pkg.packageName);
        setQuestions(
          pkg.questions.map((q, index) => ({
            id: index + 1,
            question: q.questionText,
            time: q.question_time.minutes * 60 + q.question_time.seconds,
            order: index + 1,
          }))
        );
      }
    }
  }, [isEdit, packageId, packages]);

  // Validate minutes and seconds
  useEffect(() => {
    if (timeSeconds >= 60) {
      setTimeMinutes((prevMinutes) => prevMinutes + 1);
      setTimeSeconds(0);
    }
    if (timeMinutes < 0) setTimeMinutes(0);
    if (timeSeconds < 0) setTimeSeconds(0);
  }, [timeSeconds, timeMinutes]);

  const openEditModal = (index) => {
    const questionToEdit = questions[index];
    setNewQuestion(questionToEdit.question);
    setTimeMinutes(Math.floor(questionToEdit.time / 60));
    setTimeSeconds(questionToEdit.time % 60);
    setEditingQuestionIndex(index);
    setIsModalOpen(true);
  };

  // Add or update question
  const handleAddOrUpdateQuestion = () => {
    const totalSeconds = parseInt(timeMinutes) * 60 + parseInt(timeSeconds);
    if (newQuestion.trim() === '') {
      toast.error('You cannot add an empty question. Please enter a valid question.');
    } else if (totalSeconds <= 0) {
      toast.error('Please enter a valid time.');
    } else {
      const updatedQuestion = {
        id: editingQuestionIndex !== null ? editingQuestionIndex + 1 : questions.length + 1,
        question: newQuestion,
        time: totalSeconds,
        order: editingQuestionIndex !== null ? editingQuestionIndex + 1 : questions.length + 1,
      };

      if (editingQuestionIndex !== null) {
        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[editingQuestionIndex] = updatedQuestion;
          return updatedQuestions;
        });
      } else {
        setQuestions((prevQuestions) => [...prevQuestions, updatedQuestion]);
      }

      setNewQuestion('');
      setTimeMinutes(2);
      setTimeSeconds(0);
      setIsModalOpen(false);
      setEditingQuestionIndex(null);
      toast.success('Question successfully added or updated!');
    }
  };

  // Delete question
  const handleDeleteQuestion = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((_, i) => i !== index);
      return updatedQuestions.map((q, i) => ({
        ...q,
        order: i + 1,
        id: i + 1,
      }));
    });
    toast.success('Question successfully deleted!');
  };

  // Save or update package
  const handleSavePackage = () => {
    if (packageName.trim() === '') {
      toast.error('Please enter a package name!');
    } else if (questions.length === 0) {
      toast.error('Please add at least one question to create your package!');
    } else {
      const formattedQuestions = questions.map((q) => ({
        questionText: q.question,
        question_time: {
          hours: 0,
          minutes: Math.floor(q.time / 60),
          seconds: q.time % 60,
        },
      }));

      if (isEdit) {
        updatePackage(packageId, { packageName, questions: formattedQuestions });
        toast.success('Package successfully updated!');
      } else {
        addPackage({ packageName, questions: formattedQuestions });
        toast.success('Package successfully saved!');
      }
      navigate('/manage-packages');
    }
  };

  // Drag-and-drop handling
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-6 max-w-[80%] ml-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-left text-[#142147]">
        {isEdit ? 'Edit Package' : 'Create Package'}
      </h1>

      {/* Package title input */}
      <div className="relative mt-4 mb-6">
        <input
          type="text"
          placeholder="Package Title..."
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#142147] focus:border-[#142147] transition-colors"
        />
        <button
          onClick={() => {
            setNewQuestion('');
            setTimeMinutes(2);
            setTimeSeconds(0);
            setEditingQuestionIndex(null);
            setIsModalOpen(true);
          }}
          className="absolute top-2 right-2 mt-1 group w-10 h-10 flex items-center justify-center text-2xl text-[#142147] hover:scale-110 transition-transform"
        >
          <FaPlus size={27} />
          <span className="absolute bottom-full mb-1 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#142147] text-white text-xs">
            Add Question
          </span>
        </button>
      </div>

      {/* Drag-and-drop table */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-[50px,50px,3fr,2fr,1fr] uppercase text-sm font-semibold h-10 px-6 rounded-lg shadow-md w-full lg:max-w-[1000px] mx-auto text-[#142147] bg-[#8E9FBB] mb-4">
            <div className="flex items-center pr-8 justify-center relative border-r-2 h-full border-[#fafafa]">Drag</div>
            <div className="flex items-center pr-35 justify-center relative border-r-2 h-full border-[#fafafa]">Order</div>
            <div className="flex items-center justify-center relative border-r-2 h-full border-[#fafafa]">Question</div>
            <div className="flex items-center justify-center relative border-r-2 h-full border-[#fafafa]">Time</div>
            <div className="flex items-center justify-center">Action</div>
          </div>

          <div className="space-y-4 w-full lg:max-w-[1000px] mx-auto">
            {questions.map((q, index) => (
              <SortableItem
                key={q.id}
                id={q.id}
                question={q}
                order={q.order}
                openEditModal={() => openEditModal(index)}
                handleDeleteQuestion={() => handleDeleteQuestion(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Save and Go Back Buttons */}
      <div className="flex space-x-4 mt-6 w-full lg:max-w-[1000px] mx-auto justify-start">
        <button
          onClick={handleSavePackage}
          className="bg-[#142147] text-white px-3 py-1.5 rounded scale-100 hover:scale-105 transition-transform"
        >
          Save Package
        </button>
        <button
          onClick={() => navigate('/manage-packages')}
          className="bg-[#8E9FBB] text-[#142147] px-3 py-1.5 rounded hover:scale-105 transition-transform"
        >
          Go Back
        </button>
      </div>

      {/* Add/Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#fafafa] rounded-lg shadow-lg w-[95%] sm:w-[500px] h-[300px] relative">
            <div className="flex justify-between items-center mb-4 p-4 rounded-t-lg" style={{ backgroundColor: '#8E9FBB' }}>
              <h3 className="text-lg font-bold text-[#142147]">
                {editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#142147] hover:text-gray-200 text-2xl"
              >
                <HiOutlineX />
              </button>
            </div>

            <textarea
              placeholder="Enter a question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value.slice(0, 96))}
              maxLength={96}
              className="border px-4 py-2 mb-4 w-[87%] ml-[6.5%] rounded hover:border-[#142147] focus:outline-none focus:border-[#142147] h-[100px] resize-none"
              rows="4"
            />
            <div className="flex items-center space-x-2 mt-2 mx-8">
              <input
                type="number"
                placeholder="Minutes"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                className="border px-3 py-2 w-[60px] rounded hover:border-[#142147] focus:outline-none focus:border-[#142147]"
              />
              <span className="text-lg text-[#142147]">:</span>
              <input
                type="number"
                placeholder="Seconds"
                value={timeSeconds}
                onChange={(e) => setTimeSeconds(e.target.value)}
                className="border px-3 py-2 w-[60px] rounded hover:border-[#142147] focus:outline-none focus:border-[#142147]"
              />
              <button
                onClick={handleAddOrUpdateQuestion}
                className="bg-[#142147] text-white px-4 py-2 rounded scale-100 hover:scale-105 transition-transform"
              >
                {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SortableItem Component
const SortableItem = ({ id, question, order, openEditModal, handleDeleteQuestion }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="grid grid-cols-[50px,50px,3fr,2fr,1fr] items-center gap-x-4 shadow-md rounded-lg px-4 bg-[#fafafa] text-[#142147] hover:bg-blue-50 h-[60px] relative"
    >
      <span className="cursor-move text-gray-500 hover:text-gray-700 relative border-r-2 border-[#8E9FBB]" {...listeners}>
        &#9776;
      </span>
      <div className="text-lg font-semibold text-center relative border-r-2 border-[#8E9FBB]">{order}</div>
      <div className="text-lg font-semibold text-center relative border-r-2 border-[#8E9FBB]">{question.question}</div>
      <div className="text-lg font-semibold text-center relative border-r-2 border-[#8E9FBB]">
        {Math.floor(question.time / 60)}m {question.time % 60}s
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={openEditModal} className="text-[#142147] hover:text-blue-700">
          <FaEdit className="text-xl" />
        </button>
        <button onClick={handleDeleteQuestion} className="text-[#142147] hover:text-red-700">
          <HiOutlineTrash className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CreatePackage;
