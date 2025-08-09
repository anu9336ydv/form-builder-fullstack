import React, { useState } from "react";
import QuestionImage from "../QuestionImage.jsx";
import { FaEdit, FaTimesCircle } from "react-icons/fa";

function Categorize({
  isEditing,
  question,
  onUpdate,
  onRemove,
  onAnswerChange,
  answer = {},
}) {
  // Drag-and-drop state for preview mode
  const [draggedItem, setDraggedItem] = useState(null);

  // Logic for editing mode
  const handleCategoryChange = (idx, value) => {
    const newCategories = [...(question.categories || [])];
    newCategories[idx] = value;
    onUpdate({ ...question, categories: newCategories });
  };
  const handleRemoveCategory = (idx) => {
    const newCategories = [...(question.categories || [])];
    newCategories.splice(idx, 1);
    onUpdate({ ...question, categories: newCategories });
  };
  const handleAddCategory = () => {
    onUpdate({
      ...question,
      categories: [...(question.categories || []), "New Category"],
    });
  };
  const handleItemChange = (idx, value) => {
    const newItems = [...(question.items || [])];
    newItems[idx] = value;
    onUpdate({ ...question, items: newItems });
  };
  const handleRemoveItem = (idx) => {
    const newItems = [...(question.items || [])];
    newItems.splice(idx, 1);
    // Remove correctCategory for this item if present
    const newCorrect = { ...(question.correctCategory || {}) };
    delete newCorrect[question.items[idx]];
    onUpdate({ ...question, items: newItems, correctCategory: newCorrect });
  };
  const handleAddItem = () => {
    onUpdate({ ...question, items: [...(question.items || []), "New Item"] });
  };
  const handleCorrectCategoryChange = (item, value) => {
    const newCorrect = { ...(question.correctCategory || {}) };
    newCorrect[item] = value;
    onUpdate({ ...question, correctCategory: newCorrect });
  };

  const categories = question.categories || [];
  const items = question.items || [];
  const correctCategory = question.correctCategory || {};

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
        <button
          onClick={onRemove}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          <FaTimesCircle className="text-2xl" />
        </button>
      </div>
      <QuestionImage isEditing={true} question={question} onUpdate={onUpdate} />
      <h4 className="text-lg font-semibold mb-2">Categories</h4>
      <div className="space-y-2 mb-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={cat}
              onChange={(e) => handleCategoryChange(idx, e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:border-blue-400 flex-1"
              placeholder="Category name"
            />
            <button
              onClick={() => handleRemoveCategory(idx)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimesCircle />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddCategory}
          className="mt-2 px-3 py-1 bg-blue-200 rounded hover:bg-blue-300 text-blue-700"
        >
          + Add Category
        </button>
      </div>
      <h4 className="text-lg font-semibold mb-2">Items</h4>
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:border-blue-400 flex-1"
              placeholder="Item name"
            />
            <button
              onClick={() => handleRemoveItem(idx)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimesCircle />
            </button>
            <select
              value={correctCategory[item] || ""}
              onChange={(e) =>
                handleCorrectCategoryChange(item, e.target.value)
              }
              className="p-2 border rounded-md focus:outline-none focus:border-purple-400"
            >
              <option value="">Select correct category</option>
              {categories.map((cat, cidx) => (
                <option key={cidx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="mt-2 px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 text-purple-700"
        >
          + Add Item
        </button>
      </div>
      <div className="text-xs text-gray-500">
        Assign the correct category for each item. This will be used for answer
        checking.
      </div>
    </div>
  );

  // Logic for preview mode (drag-and-drop)
  const renderPreview = () => {
    // Items not yet categorized
    const uncategorizedItems =
      question.items?.filter((item) => !Object.keys(answer).includes(item)) ||
      [];

    // Handle drag events
    const handleDragStart = (item) => setDraggedItem(item);
    const handleDragEnd = () => setDraggedItem(null);
    const handleDrop = (category) => {
      if (draggedItem) {
        const newAnswer = { ...answer, [draggedItem]: category };
        onAnswerChange(newAnswer);
        setDraggedItem(null);
      }
    };
    const handleRemoveFromCategory = (item) => {
      const newAnswer = { ...answer };
      delete newAnswer[item];
      onAnswerChange(newAnswer);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{question.title}</h3>
        <QuestionImage isEditing={false} question={question} />
        <h4 className="text-lg font-semibold mb-2">Categories:</h4>
        <div className="flex flex-wrap gap-4">
          {question.categories?.map((category, index) => (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded-md shadow-sm min-w-[120px] min-h-[60px] flex flex-col items-center justify-start transition-all duration-200 border-2 border-dashed border-gray-400 hover:border-blue-400"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(category)}
            >
              <span className="font-semibold mb-2">{category}</span>
              <div className="flex flex-col gap-1 w-full">
                {Object.entries(answer)
                  .filter(([item, cat]) => cat === category)
                  .map(([item]) => (
                    <div
                      key={item}
                      className="bg-blue-200 p-2 rounded-md shadow-sm flex items-center justify-between cursor-pointer group animate-fade-in"
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      onDragEnd={handleDragEnd}
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        className="ml-2 text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleRemoveFromCategory(item)}
                        title="Remove from category"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <h4 className="text-lg font-semibold mb-2 mt-4">Items to Drag:</h4>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {uncategorizedItems.length === 0 && (
            <span className="text-gray-400 italic">All items categorized!</span>
          )}
          {uncategorizedItems.map((item, index) => (
            <div
              key={index}
              className={`bg-blue-200 p-2 rounded-md shadow-sm cursor-move transition-all duration-200 animate-fade-in ${
                draggedItem === item ? "opacity-50" : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragEnd={handleDragEnd}
            >
              {item}
            </div>
          ))}
        </div>
        {/* Animations */}
        <style>{`
          .animate-fade-in { animation: fade-in 0.5s; }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    );
  };

  return isEditing ? renderEditor() : renderPreview();
}

export default Categorize;
