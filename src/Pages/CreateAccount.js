import { ContactBar, MakeQuestions } from "../Components";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { authenticatedFetch } from "../utils/api";
import api from "../api";

function CreateAccount() {
  const navigate = useNavigate();

  // Security Questions States
  const [answeredIndexes, setAnsweredIndexes] = useState([-1, -1]);
  const [answers, setAnswers] = useState(["", ""]);

  // General info states
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Registration Key
  const [registrationKey, setRegistrationKey] = useState("");

  // Error state
  const [error, setError] = useState(null);

  //Add logic to handle API to create account here
  const handleCreateAccount = async () => {
    if (!userName || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (answeredIndexes.includes(-1)) {
      setError("Please answer all security questions!");
      return;
    }
    if (answers.includes("")) {
      setError("Please fill in all answers to the security questions!");
      return;
    }
    if (!registrationKey) {
      setError("Please enter a registration key!");
      return;
    }

    //API Call
    try {
      await api.post("/register", {
        id: registrationKey,
        username: userName,
        password: password,
        secQ: answeredIndexes,
        secA: answers,
      });
      // After successful account creation, get a token by logging in
      try {
        const loginData = await api.post("/login", {
          username: userName,
          password: password,
        });
        const data = await loginData.data;
        // Store the JWT token properly
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", userName);

        try {
          const userRoleData = await authenticatedFetch(
            `/account-mgr/info?accountID=${data.userId}`,
            {
              method: "POST",
            }
          );

          if (userRoleData.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/dash");
          }
        } catch (error) {
          console.error(
            "Failed to fetch user role after account creation:",
            error
          );
          navigate("/");
        }
      } catch (error) {
        console.error("Auto-login failed after account creation:", error);
        navigate("/");
      }
    } catch (err) {
      console.error("Create Account failed: ", err);
      setError(
        err.response?.data || "Account creation failed. Please try again."
      );
    }
  };

  return (
    // Background
    <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
      {/* Nav Bar */}
      <div
        className="w-full h-24 left-0 top-0"
        style={{ backgroundColor: "#A5907E", paddingLeft: "20px" }}
      >
        <div className="h-full flex items-center ">
          <span className="text-white text-6xl font-['Roboto']">BiteSync</span>
        </div>
      </div>

      {/* Outer Dash Box */}
      <div
        className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-4"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        {/* Inner Dash Box 1 */}
        <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter']">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 absolute"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>

          <h1 className="text-4xl font-semibold mb-6 text-center items-center">
            Create Account
          </h1>

          {/* User name prompt */}
          <div className="flex flex-col gap-2 text-xl">
            {/* Username input */}
            <div>Username</div>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={127}
              className="p-3 border border-gray-300 rounded-lg"
            />

            {/* Password Prompt */}
            <div>Password</div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={127}
              className="p-3 border border-gray-300 rounded-lg"
            />

            {/* Confirm Password Prompt */}
            <div>Confirm Password</div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={127}
              className="p-3 border border-gray-300 rounded-lg mb-4"
            />
          </div>
        </div>

        {/* Inner Dash Block 2 */}
        <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter']">
          <h1 className="text-4xl font-semibold mb-6 text-center items-center">
            Security Questions
          </h1>
          <MakeQuestions
            setAnsweredIndexes={setAnsweredIndexes}
            setAnswers={setAnswers}
          />
        </div>

        {/* Inner Dash Block 3 */}
        <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter']">
          <h1 className="text-4xl font-semibold mb-6 text-center items-center">
            Registration Key
          </h1>
          <div className="mb-4 flex flex-col items-start justify-center text-xl">
            <p className="p-1">
              Please enter the registration key provided to you.
            </p>
            <input
              type="text"
              placeholder="Enter your registration key"
              value={registrationKey}
              onChange={(e) => setRegistrationKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateAccount();
                }
              }}
              maxLength={50}
              className="p-3 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div>
        {/* Error Message */}
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}

        <button
          onClick={handleCreateAccount}
          className="w-[50%] mt-6 p-3 bg-[#746056] text-white rounded-lg hover:bg-[#54463e] transition duration-200"
        >
          Create Account
        </button>
      </div>

      {/* Contact Bar */}
      <ContactBar />
    </div>
  );
}

export default CreateAccount;
