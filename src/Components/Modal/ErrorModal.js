function ErrorModal({ message, object, onConfirm }) {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Error
      </div>
      <div className="w-[90%] p-4 rounded-lg mb-4 text-lg flex items-center justify-center">
        Error with {object}:
        <br />
        {message}
        <br />
        Please try again or relogin.
        <br />
        If error persists email an error report.
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 text-white rounded-lg p-2 text-xl flex items-center justify-center"
          style={{ width: "500px" }}
          onClick={onConfirm}
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
