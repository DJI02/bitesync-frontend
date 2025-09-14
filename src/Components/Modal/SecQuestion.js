import React, { useState } from "react";
import api from "../../api";

const SecQuestion = ({ questionIndexes, newPassword, accountID }) => {
  const totalQuestions = [
    "What is your favorite color?",
    "What is your mother's maiden name?",
    "What was your first pet's name?",
    "What is the name of your first school?",
    "What is your favorite book?",
  ];

  const [answers, setAnswers] = useState(
    Array(questionIndexes.length).fill("")
  );
  const [error, setError] = useState("");

  const selectedQuestions = questionIndexes.map(
    (index) => totalQuestions[index]
  );

  const handleNewPasswordChange = async () => {
    try {
      await api.put(`/account-mgr/password`, {
        id: accountID,
        secA: answers,
        password: newPassword,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating username:", error);
      setError("Failed to update password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full font-['Inter']">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Enter Security Questions
      </div>
      <div className="w-[90%] p-4 rounded-lg mb-4 flex flex-col items-center justify-center gap-4">
        {/* Designed to allow for even spacing */}
        <p className="error min-h-[1.5rem] text-red-500">{"\u00A0"}</p>

        {/* Maps selected questions to input fields */}
        {selectedQuestions.map((question, index) => (
          <div key={index} className="mb-2 bg-[#F4EFE9] p-4 rounded-lg w-full">
            <label className="block text-lg mb-1">{question}</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewPasswordChange();
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg text-lg"
            />
          </div>
        ))}

        {/* Either displays error or allows for consistent spacing of info */}
        <p className="error min-h-[1.5rem] text-red-500">{error || "\u00A0"}</p>
      </div>

      {/* Moves to process password change */}
      <button
        onClick={handleNewPasswordChange}
        className="bg-blue-500 text-white rounded-lg p-2 text-xl"
        style={{ width: "500px" }}
      >
        Submit
      </button>
    </div>
  );
};

export default SecQuestion;
