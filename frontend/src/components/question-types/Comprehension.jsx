import React from 'react';
import QuestionImage from '../QuestionImage.jsx';
import { FaEdit, FaTimesCircle, FaPlus } from 'react-icons/fa';

function Comprehension({ isEditing, question, onUpdate, onRemove, onAnswerChange, answer = {} }) {
  const handleSubQuestionUpdate = (subIndex, updatedSubQ) => {
    const updatedSubQuestions = question.subQuestions.map((subQ, i) =>
      i === subIndex ? { ...subQ, ...updatedSubQ } : subQ
    );
    onUpdate({ ...question, subQuestions: updatedSubQuestions });
  };

  const handleAddSubQuestion = () => {
    const newSubQuestion = {
        question: 'New MCQ Question',
        options: ['Option 1', 'Option 2'],
        correctAnswer: ''
    };
    onUpdate({ ...question, subQuestions: [...question.subQuestions, newSubQuestion] });
  };

  const handleRemoveSubQuestion = (subIndex) => {
    const updatedSubQuestions = question.subQuestions.filter((_, i) => i !== subIndex);
    onUpdate({ ...question, subQuestions: updatedSubQuestions });
  };
  
  // Logic for editing mode
  const renderEditor = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={question.title}
          onChange={(e) => onUpdate({ ...question, title: e.target.value })}
          className="text-xl font-bold w-full p-2 border rounded-md focus:outline-none focus:border-blue-400"
          placeholder="Question Title"
        />
        <button onClick={onRemove} className="ml-4 text-red-500 hover:text-red-700">
          <FaTimesCircle className="text-2xl" />
        </button>
      </div>
      <QuestionImage isEditing={true} question={question} onUpdate={onUpdate} />
      <h4 className="text-lg font-semibold mb-2">Comprehension Passage</h4>
      <textarea
        value={question.text || ''}
        onChange={(e) => onUpdate({ ...question, text: e.target.value })}
        className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-400"
        rows="8"
        placeholder="Type the passage here..."
      />

      <div className="mt-6 space-y-4">
        <h5 className="text-lg font-semibold">Multiple Choice Questions</h5>
        {question.subQuestions?.map((subQ, subIndex) => (
          <div key={subIndex} className="bg-gray-100 p-4 rounded-md relative">
            <input
              type="text"
              value={subQ.question}
              onChange={(e) => handleSubQuestionUpdate(subIndex, { ...subQ, question: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter MCQ question"
            />
            <button onClick={() => handleRemoveSubQuestion(subIndex)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <FaTimesCircle />
            </button>
            <h6 className="text-sm font-medium mt-2">Options (comma-separated)</h6>
            <input
              type="text"
              value={subQ.options?.join(', ') || ''}
              onChange={(e) => handleSubQuestionUpdate(subIndex, { ...subQ, options: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Option A, Option B"
            />
          </div>
        ))}
        <button onClick={handleAddSubQuestion} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          <FaPlus className="inline-block mr-1" /> Add MCQ Question
        </button>
      </div>
    </div>
  );

  // Logic for preview mode
  const renderPreview = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{question.title}</h3>
      <QuestionImage isEditing={false} question={question} />
      <h4 className="text-lg font-semibold mb-2">Passage:</h4>
      <p className="mb-4 whitespace-pre-wrap">{question.text}</p>
      <div className="space-y-4">
        {question.subQuestions?.map((subQ, subIndex) => (
          <div key={subIndex}>
            <p className="font-medium">{subQ.question}</p>
            {subQ.options?.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`comprehension-${subIndex}`}
                  value={option}
                  onChange={() => {
                    const newAnswers = { ...answer };
                    newAnswers[subIndex] = option;
                    onAnswerChange(newAnswers);
                  }}
                  checked={answer[subIndex] === option}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return isEditing ? renderEditor() : renderPreview();
}

export default Comprehension;