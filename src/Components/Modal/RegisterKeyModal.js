import { authenticatedFetch } from "../../utils/api";
import { useEffect, useState } from "react";

function RegisterKeyModal() {
  const [newUserKey, setNewUserKey] = useState("");
  const [newAdminKey, setNewAdminKey] = useState("");

  // Error and success messages can be added later if needed
  const [message, setMessage] = useState("");

  const setKey = async (key, role) => {
    try {
      await authenticatedFetch("/admin/key", {
        method: "POST",
        data: [localStorage.getItem("userId"), role, key],
      });
      setMessage(role);
    } catch (error) {
      setMessage(role + "ERROR");
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Modal for resetting the registration key
  return (
    <div className="flex flex-col items-center justify-start h-full w-full font-['Inter'] gap-2">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Begin Password Reset
      </div>

      <p className="text-sm">
        When resetting keys, please note the key down in a safe place.
      </p>

      {/* User Registration Key */}
      <div className="w-[90%] bg-[#F4EFE9] p-4 h-auto flex flex-col justify-center items-center gap-4 rounded-lg text-lg mb-1">
        <div className="text-start text-lg p-1 self-start">
          Enter new user registration key
        </div>
        <input
          placeholder="User registration Key"
          className="p-2 border border-gray-300 rounded-lg w-full"
          value={newUserKey}
          onChange={(e) => setNewUserKey(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded-lg p-2 text-xl flex items-center justify-center"
          style={{ width: "500px" }}
          onClick={() => {
            setKey(newUserKey, "USER");
          }}
        >
          Reset
        </button>
        {message === "USER" ? (
          <span className="text-green-600 text-sm">User key reset!</span>
        ) : message === "USERERROR" ? (
          <span className="text-red-600 text-sm">
            Error resetting user key.
          </span>
        ) : null}
      </div>

      {/* Admin Registration Key */}
      <div className="w-[90%] bg-[#F4EFE9] p-4 h-auto flex flex-col justify-center items-center gap-4 rounded-lg text-lg mb-1">
        <div className="text-start text-lg p-1 self-start">
          Enter new admin registration key
        </div>
        <input
          placeholder="Admin registration Key"
          className="p-2 border border-gray-300 rounded-lg w-full"
          value={newAdminKey}
          onChange={(e) => setNewAdminKey(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded-lg p-2 text-xl flex items-center justify-center"
          style={{ width: "500px" }}
          onClick={() => setKey(newAdminKey, "ADMIN")}
        >
          Reset
        </button>
        {message === "ADMIN" ? (
          <span className="text-green-600 text-sm">Admin key reset!</span>
        ) : message === "ADMINERROR" ? (
          <span className="text-red-600 text-sm">
            Error resetting admin key.
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default RegisterKeyModal;
