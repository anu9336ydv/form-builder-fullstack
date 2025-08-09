import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm, submitForm } from "../api/formApi";
import HeaderImage from "./HeaderImage.jsx";
import Categorize from "./question-types/Categorize.jsx";
import Cloze from "./question-types/Cloze.jsx";
import Comprehension from "./question-types/Comprehension.jsx";

function FormPreview() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
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
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitForm(formId, answers);
      // Simulate animation delay for effect
      await new Promise((res) => setTimeout(res, 300));
      alert("Form submitted successfully!");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
        <div className="w-16 h-16 border-4 border-green-400 border-dashed rounded-full animate-spin mb-4"></div>
        <div className="text-xl text-green-700 font-semibold animate-pulse">
          Loading form...
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center mt-8 text-red-600 animate-fade-in">
        Form not found.
      </div>
    );
  }

  const renderQuestionComponent = (question, index) => {
    const props = {
      isEditing: false,
      question,
      onAnswerChange: (value) => handleAnswerChange(index, value),
      answer: answers[index] || "",
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

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl shadow-2xl animate-fade-in-up">
      <HeaderImage isEditing={false} />

      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-500 to-purple-500 drop-shadow-lg mb-6 animate-bounce-slow">
        {form.title || "Untitled Form"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.questions.map((question, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md fade-in-card transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-700 animate-fade-in">
              {question.title}
            </h3>
            <QuestionImage isEditing={false} question={question} />
            {renderQuestionComponent(question, index)}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-blue-600 hover:scale-105 transition-all duration-200 animated-btn"
        >
          Submit Form
        </button>
      </form>

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

export default FormPreview;
