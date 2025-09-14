import SecurityDrop from "./SecurityDrop";
import { useState, useEffect } from "react";

function MakeQuestions({ setAnsweredIndexes, setAnswers }) {
  const totalQuestions = [
    "What is your favorite color?",
    "What is your mother's maiden name?",
    "What was your first pet's name?",
    "What is the name of your first school?",
    "What is your favorite book?",
  ];
  const [selectedQuestions, setSelectedQuestions] = useState(["", ""]);
  const questionsInUse = totalQuestions.filter(
    (q) => !selectedQuestions?.includes(q)
  );
  const [answer, setAnswer] = useState(["", ""]);
  // const questionIndex = selectedQuestions?.map((q) =>
  //   totalQuestions.indexOf(q)
  // );

  useEffect(() => {}, [selectedQuestions]);

  const questionNumber = 2;

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: questionNumber }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          {/* Question Prompt */}
          <SecurityDrop
            questions={questionsInUse}
            setSelectedQuest={(question) => {
              const newSelected = [...selectedQuestions];
              newSelected[index] = question;
              setSelectedQuestions(newSelected);
              setAnsweredIndexes(
                newSelected.map((q) => totalQuestions.indexOf(q))
              );
            }}
          />

          {/* Answer Prompt */}
          <input
            type="text"
            placeholder={`Answer ${index + 1}`}
            value={answer[index]}
            maxLength={127}
            onChange={(e) => {
              const newAnswers = [...answer];
              newAnswers[index] = e.target.value;
              setAnswer(newAnswers);
              setAnswers(newAnswers);
            }}
            className="p-3 border border-gray-300 rounded-lg text-xl"
          />
        </div>
      ))}
    </div>
  );
}

export default MakeQuestions;
