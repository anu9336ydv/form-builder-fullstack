import React, { useState } from "react";
import QuestionImage from "../QuestionImage.jsx";
import { FaEdit, FaTimesCircle } from "react-icons/fa";

function Cloze({
  isEditing,
  question,
  onUpdate,
  onRemove,
  onAnswerChange,
  answer = {},
}) {
  // --- Editor: Underline words to create blanks ---
  const [editText, setEditText] = useState(question.text || "");
  const [structure, setStructure] = useState(question.structure || null);

  // Parse text into words and blanks
  const parseText = (text, blanks = []) => {
    const words = text.split(/(\s+)/);
    return words.map((word, idx) => ({
      text: word,
      blank: blanks.includes(idx),
      idx,
    }));
  };

  // On first load, if structure is not set, parse from text
  React.useEffect(() => {
    if (!structure) {
      setStructure(parseText(editText));
    }
    // eslint-disable-next-line
  }, []);

  // Underline click handler
  const handleWordClick = (idx) => {
    const newStructure = structure.map((w) =>
      w.idx === idx ? { ...w, blank: !w.blank } : w
    );
    setStructure(newStructure);
    // Save to question
    onUpdate({ ...question, structure: newStructure, text: editText });
  };

  // Textarea change handler
  const handleTextChange = (e) => {
    setEditText(e.target.value);
    const newStructure = parseText(e.target.value, []);
    setStructure(newStructure);
    onUpdate({ ...question, structure: newStructure, text: e.target.value });
  };

  // Editor UI
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
      <h4 className="text-lg font-semibold mb-2">
        Cloze Text (Click words to underline for blanks)
      </h4>
      <textarea
        value={editText}
        onChange={handleTextChange}
        className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-400 mb-2"
        rows="4"
        placeholder="Type your sentence, then click words below to make blanks."
      />
      <div className="flex flex-wrap gap-1 bg-gray-50 p-2 rounded min-h-[48px]">
        {structure &&
          structure.map((w, i) =>
            w.text.trim() === "" ? (
              <span key={i}>{w.text}</span>
            ) : (
              <span
                key={i}
                onClick={() => handleWordClick(w.idx)}
                className={`cursor-pointer px-1 rounded transition-all duration-200 ${
                  w.blank
                    ? "underline decoration-blue-600 font-bold bg-blue-100"
                    : "hover:bg-blue-50"
                }`}
                style={{ userSelect: "none" }}
              >
                {w.text}
              </span>
            )
          )}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Click a word to toggle blank. Underlined words will become blanks for
        the student.
      </div>
    </div>
  );

  // --- Preview: Render text with blanks as inputs ---
  const renderPreview = () => {
    const struct = question.structure || parseText(question.text || "", []);
    let blankIdx = 0;
    const handleFillInTheBlankChange = (e, idx) => {
      const newAnswers = { ...answer };
      newAnswers[idx] = e.target.value;
      onAnswerChange(newAnswers);
    };
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{question.title}</h3>
        <QuestionImage isEditing={false} question={question} />
        <p className="text-lg mb-4 flex flex-wrap gap-1">
          {struct.map((w, i) =>
            w.blank ? (
              <input
                key={i}
                type="text"
                className="w-24 border-b border-blue-400 mx-1 p-1 focus:outline-none bg-blue-50 rounded"
                onChange={(e) => handleFillInTheBlankChange(e, blankIdx)}
                value={answer[blankIdx++] || ""}
                style={{ minWidth: 60 }}
              />
            ) : (
              <span key={i}>{w.text}</span>
            )
          )}
        </p>
      </div>
    );
  };

  return isEditing ? renderEditor() : renderPreview();
}

export default Cloze;
