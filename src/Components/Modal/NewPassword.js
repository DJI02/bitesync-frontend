import { useEffect, useState } from "react";

function NewPassword({ setPassword }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!newPassword || !confirmPassword) return;
    else if (newPassword !== confirmPassword) {
      // Handle password mismatch
      setError("Passwords do not match");
      return;
    } else if (newPassword.length < 7 || newPassword.includes(" ")) {
      setError(
        "Password must be at least 7 characters long and cannot contain spaces"
      );
      return;
    } else if (newPassword.length > 128) {
      setError("Password is too long");
      return;
    } else {
      setError("");
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e) => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    e.preventDefault();
    setPassword(newPassword);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full font-['Inter']">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Set Password
      </div>

      {/* Password Inputs */}
      <div className="w-[90%] p-4 rounded-lg mb-4 flex flex-col items-center justify-center gap-4">
        <p> {"\u00A0"} </p>
        <div className="mb-2 bg-[#F4EFE9] p-4 rounded-lg w-full">
          <label className="block text-lg mb-1">New Password:</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>
        <div className="mb-2 bg-[#F4EFE9] p-4 rounded-lg w-full">
          <label className="block text-lg mb-1">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>
        <p className="error min-h-[1.5rem] text-red-500">{error || "\u00A0"}</p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded-lg p-2 text-xl"
        style={{ width: "500px" }}
      >
        Submit
      </button>
    </div>
  );
}

export default NewPassword;
