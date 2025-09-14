import { useState } from "react";

function ConfirmAccount({ setUser }) {
  const [error, setError] = useState("");
  const [userToFind, setUserToFind] = useState("");

  const getUser = async () => {
    try {
      const response = await fetch(
        `/change-password?username=${encodeURIComponent(userToFind)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUser(data);
      setError("");
      return data;
    } catch (err) {
      setError(err.message);
      setUser(null);
      return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full font-['Inter']">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Begin Password Reset
      </div>

      {/* Form box */}
      <div className="w-[90%] bg-[#F4EFE9] p-3 h-[50%] flex-col justify-center gap-2 rounded-lg block text-lg mb-1">
        Enter Your Username
        <input
          type="text"
          value={userToFind}
          onChange={(e) => {
            setUserToFind(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getUser();
            }
          }}
          placeholder="Enter username"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <p className="text-red-500 text-sm">{error ? error : ""}</p>
      </div>
      <button
        onClick={getUser}
        className="bg-blue-500 text-white rounded-lg p-2 text-xl"
        style={{ width: "500px" }}
      >
        Submit
      </button>
    </div>
  );
}

export default ConfirmAccount;
