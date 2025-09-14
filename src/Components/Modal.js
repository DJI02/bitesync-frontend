import React, { useEffect } from "react";

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="bg-white fixed flex flex-col p-5 items-start justify-start rounded-lg shadow-lg overflow-auto"
        style={{ width: `70%`, height: `70%` }}
      >
        {children}
        <button
          className="absolute"
          style={{ right: "2rem", top: "2rem" }}
          onClick={onClose}
        >
          <span className="text-2xl font-bold">X</span>
        </button>
      </div>
    </div>
  );
}

export default Modal;
