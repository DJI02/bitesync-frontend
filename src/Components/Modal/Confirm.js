function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-5">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Confirm Action
      </div>
      <div className="w-[90%] p-4 rounded-lg mb-4 text-lg flex items-center justify-center">
        {message}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Confirm;
