import React from 'react';
import { FaImage, FaTrash } from 'react-icons/fa';
import { uploadImage } from '../api/formApi';

function QuestionImage({ isEditing, question, onUpdate }) {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await uploadImage(file);
        onUpdate({ ...question, image: response.data.imageUrl });
      } catch (err) {
        console.error('Question image upload failed:', err);
      }
    }
  };

  const handleRemoveImage = () => {
    onUpdate({ ...question, image: '' });
  };

  if (!isEditing && !question.image) {
    return null;
  }

  return (
    <div className="my-4 relative">
      {question.image ? (
        <>
          <img src={question.image} alt="Question" className="max-h-56 object-contain rounded-md" />
          {isEditing && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
              title="Remove Question Image"
            >
              <FaTrash />
            </button>
          )}
        </>
      ) : (
        isEditing && (
          <div className="bg-gray-100 p-4 flex items-center justify-center border-dashed border-2 border-gray-300 rounded-md">
            <label className="cursor-pointer bg-blue-500 text-white p-2 rounded-lg font-semibold text-sm hover:bg-blue-600 transition">
              <FaImage className="inline-block mr-1" /> Add Image
              <input type="file" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        )
      )}
    </div>
  );
}

export default QuestionImage;