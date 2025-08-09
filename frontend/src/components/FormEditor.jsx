import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormStore } from "../state/formStore";
import { getForm, updateForm } from "../api/formApi";
import HeaderImage from "./HeaderImage.jsx";
import Categorize from "./question-types/Categorize.jsx";
import Cloze from "./question-types/Cloze.jsx";
import Comprehension from "./question-types/Comprehension.jsx";
import { FaPlusCircle } from "react-icons/fa";

function FormEditor() {
  const { formId } = useParams();
  const { form, setForm, addQuestion, updateQuestion, removeQuestion } =
    useFormStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await getForm(formId);
        setForm(response.data);
      } catch (err) {
        console.error("Failed to fetch form:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId, setForm]);

  const handleSaveForm = async () => {
    try {
      await updateForm(formId, form);
      alert("Form saved successfully!");
    } catch (err) {
      console.error("Failed to save form:", err);
      alert("Failed to save form.");
    }
  };

  // Now async for future extensibility (e.g., animations, API, etc.)
  const handleAddQuestion = async (type) => {
    let newQuestion;
    if (type === "Categorize") {
      newQuestion = {
        type,
        title: `New ${type} Question`,
        categories: ["Category 1", "Category 2"],
        items: ["Item 1", "Item 2"],
      };
    } else if (type === "Comprehension") {
      newQuestion = {
        type,
        title: `New ${type} Question`,
        text: "Enter your comprehension passage here...",
        subQuestions: [
          {
            question: "New MCQ Question",
            options: ["Option A", "Option B"],
            correctAnswer: "",
          },
        ],
      };
    } else {
      newQuestion = {
        type,
        title: `New ${type} Question`,
        text: "Type your text here with [blank] placeholders.",
      };
    }
    // Simulate animation delay for effect
    await new Promise((res) => setTimeout(res, 200));
    addQuestion(newQuestion);
  };

  const renderQuestionComponent = (question, index) => {
    const props = {
      isEditing: true,
      question,
      onUpdate: (updatedQ) => updateQuestion(index, updatedQ),
      onRemove: () => removeQuestion(index),
    };
    switch (question.type) {
      case "Categorize":
        return <Categorize {...props} />;
      case "Cloze":
        return <Cloze {...props} />;
      case "Comprehension":
        return <Comprehension {...props} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
        <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-4"></div>
        <div className="text-xl text-blue-700 font-semibold animate-pulse">
          Loading form...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-2xl animate-fade-in-up">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg text-center mb-8 animate-bounce-slow">
        Form Editor
      </h1>

      <HeaderImage isEditing={true} />

      <div className="space-y-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-inner fade-in-card">
          <input
            type="text"
            placeholder="Form Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="text-3xl font-bold w-full p-2 border-b-2 border-gray-200 focus:outline-none focus:border-blue-400 transition bg-gradient-to-r from-blue-50 to-purple-50"
          />
        </div>

  {form.questions.map((question, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md relative fade-in-card transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
          >
            {renderQuestionComponent(question, index)}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleAddQuestion("Categorize")}
            className="bg-purple-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-purple-700 hover:scale-105 transition-all duration-200 animated-btn"
          >
            <FaPlusCircle className="inline-block mr-2 animate-bounce" /> Add
            Categorize
          </button>
          <button
            onClick={() => handleAddQuestion("Cloze")}
            className="bg-yellow-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-yellow-700 hover:scale-105 transition-all duration-200 animated-btn"
          >
            <FaPlusCircle className="inline-block mr-2 animate-bounce" /> Add
            Cloze
          </button>
          <button
            onClick={() => handleAddQuestion("Comprehension")}
            className="bg-indigo-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-200 animated-btn"
          >
            <FaPlusCircle className="inline-block mr-2 animate-bounce" /> Add
            Comprehension
          </button>
        </div>
        <button
          onClick={handleSaveForm}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 hover:scale-110 transform transition-all duration-300 w-full sm:w-auto animated-btn"
        >
          Save Form
        </button>
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
        .fade-in-card {
          animation: fade-in-up 0.7s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}

export default FormEditor;
