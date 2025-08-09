import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { createForm } from "./api/formApi.js";
import FormEditor from "./components/FormEditor.jsx";
import FormPreview from "./components/FormPreview.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:formId" element={<FormEditor />} />
          <Route path="/preview/:formId" element={<FormPreview />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => {
  const [formId, setFormId] = useState("");
  const [newFormId, setNewFormId] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleCreateNewForm = async () => {
    try {
      const response = await createForm();
      setNewFormId(response.data._id);
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedImage(file);
      // Async for future extensibility (e.g., upload, compress, etc.)
      const url = await Promise.resolve(URL.createObjectURL(file));
      setImagePreview(url);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      const url = await Promise.resolve(URL.createObjectURL(file));
      setImagePreview(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 animate-fade-in">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg animate-bounce-slow">
        Custom Form Builder
      </h1>

      {/* Drag and Drop Image Upload */}
      <div
        className={`w-full max-w-md mx-auto p-6 rounded-2xl border-4 border-dashed transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50 scale-105 shadow-xl"
            : "border-purple-200 bg-white/80"
        } flex flex-col items-center justify-center cursor-pointer fade-in-card`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
        style={{ minHeight: 180 }}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="max-h-40 rounded-xl shadow-lg border-2 border-blue-200 animate-fade-in"
          />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2 animate-bounce">🖼️</span>
            <span className="text-lg text-gray-600 font-semibold">
              Drag & Drop an image here, or click to select
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Enter Form ID to edit"
          value={formId}
          onChange={(e) => setFormId(e.target.value)}
          className="p-3 border-2 border-blue-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-md transition-all duration-300 hover:scale-105 bg-white"
        />
        <button
          onClick={() => navigate(`/editor/${formId}`)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 hover:scale-110 transform transition-all duration-300 font-bold tracking-wide"
        >
          <span className="inline-block animate-pulse">✏️</span> Edit Form
        </button>
      </div>
      <div className="space-y-4 text-center">
        <button
          onClick={handleCreateNewForm}
          className="bg-gradient-to-r from-green-400 to-blue-400 text-white p-3 rounded-xl shadow-lg hover:from-green-500 hover:to-blue-500 hover:scale-110 transform transition-all duration-300 font-bold tracking-wide animate-wiggle"
        >
          <span className="inline-block animate-bounce">➕</span> Create New
          Form
        </button>
        {newFormId && (
          <div className="mt-4 p-4 bg-white rounded-xl shadow-xl border border-purple-200 animate-fade-in-up">
            <p className="text-gray-700 text-base font-semibold">
              New Form ID:
              <span className="font-mono bg-gray-100 p-1 rounded-md ml-2 text-purple-700 text-lg animate-flash">
                {newFormId}
              </span>
            </p>
            <div className="flex flex-row justify-center mt-3 space-x-4">
              <button
                onClick={() => navigate(`/editor/${newFormId}`)}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200 shadow-md border border-blue-200 animate-fade-in"
              >
                Go to Editor
              </button>
              <button
                onClick={() => navigate(`/preview/${newFormId}`)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200 hover:scale-105 transition-all duration-200 shadow-md border border-purple-200 animate-fade-in"
              >
                Go to Preview
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-in;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-wiggle {
          animation: wiggle 1.2s infinite;
        }
        @keyframes flash {
          0%, 100% { background: #f3e8ff; }
          50% { background: #c4b5fd; }
        }
        .animate-flash {
          animation: flash 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
