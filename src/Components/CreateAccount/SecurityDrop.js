import React, { useEffect, useState, useRef } from "react";

function SecurityDrop({ questions, setSelectedQuest = () => {} }) {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block w-full h-12 text-xl"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="bg-white px-4 py-2 h-10 w-full border border-black flex items-center justify-start rounded-lg overflow-auto"
      >
        {selectedQuestion || "Select a security question"}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded shadow-lg z-50 overflow-auto h-32">
          {/* Generate each question by the indexes avaliable */}
          {questions.map((question, index) => (
            <div
              key={index}
              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedQuestion(question);
                setSelectedQuest(question);
                setOpen(false);
              }}
            >
              {question}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SecurityDrop;
