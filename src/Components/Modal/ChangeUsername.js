import { useState } from "react";
import { authenticatedFetch } from "../../utils/api";
import { useNavigate } from "react-router-dom";

function NewVal({ message }) {
  const [username, setUsername] = useState(localStorage.userName);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = async () => {
    try {
      await authenticatedFetch(`/account-mgr/username`, {
        method: "PUT",
        data: {
          id: localStorage.getItem("userId"),
          username: username,
        },
      });
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error updating username:", error);
      setError("Failed to update username");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full font-['Inter']">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Update Username
      </div>
      {/* Form box */}
      <div className="w-[90%] bg-[#F4EFE9] p-3 h-[50%] flex flex-col justify-center gap-2 rounded-lg text-lg mb-1">
        Enter New Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter new username"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <p className="text-red-500 text-sm">
          {error ? error : "Will require logging in again"}
        </p>
      </div>
      <button
        onClick={handleUsernameChange}
        className="bg-blue-500 text-white rounded-lg p-2 text-xl"
        style={{ width: "500px" }}
      >
        Submit
      </button>
    </div>
  );
}

export default NewVal;
