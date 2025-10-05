import {
  ContactBar,
  ConfirmAccount,
  Modal,
  SecQuestion,
  NewPassword,
} from "../Components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authenticatedFetch } from "../utils/api";
import api from "../api";

async function wakeup() {
  const wakeup = document.getElementById('wakeup');
  try {
    const response = await fetch(api.get("/wakeup"));
    const data = await response.json();
    console.log(data);
    wakeup.innerHTML = '<p>Server Active.</p>';
  } catch(error) {
    console.error("Connection failed: ", error);
    wakeup.innerHTML = '<p>Connection failed.</p>';
  }
}

function Login() {
  wakeup();

  const navigate = useNavigate();

  const [userName, setUserName] = useState(""); // Holds the username to be sent to the login API
  const [password, setPassword] = useState(""); // Holds the password to be sent to the login API
  const [error, setError] = useState(""); // Holds any error messages from the login API, used to display error to user

  // Modal States
  const [confirmAccountOpen, setConfirmAccountOpen] = useState(false);
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [securityQuestionsOpen, setSecurityQuestionsOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(
    window.innerWidth < 768
  );

  // Reset Password States
  const [resetID, setResetID] = useState(null);
  const [secQuestions, setSecQuestions] = useState([]);
  const [newPass, setNewPass] = useState("");

  // Add logic to handle login check here
  const handleLogin = async () => {
    if (!userName || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await api.post("/login", {
        username: userName,
        password: password,
      });
      const data = await response.data;

      // Store info in localStorage to be used across the app
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", userName);

      // ******* Runs view event to get the user role
      try {
        const userRoleResponse = await authenticatedFetch(
          `/account-mgr/info?accountID=${data.userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userRoleData = await userRoleResponse;
        if (userRoleData.role === "ADMIN") {
          localStorage.setItem("userRole", "ADMIN");
          navigate("/admin");
        } else {
          try {
            const favoritesResponse = await authenticatedFetch(
              `/recipe-book/favorites?accountID=${data.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const favoritesData = await favoritesResponse;
            localStorage.setItem("favorites", JSON.stringify(favoritesData));
          } catch (error) {
            console.error("Failed to fetch favorites:", error);
          }
          navigate("/dash");
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setError("Error with login function, please contact support.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    }
  };

  // **** Handle Forgot Password API Interactions
  // Takes the user info from confirmAccount and splits it into ID and secQuestions
  const handleConfirmAccount = (userInfo) => {
    if (!userInfo) return;
    setResetID(userInfo?.id || null);
    setSecQuestions(userInfo?.secQ || []);

    if (userInfo.id !== null && userInfo.secQ && userInfo.secQ.length > 0) {
      // If we have a valid user ID and security questions, we can proceed
      setConfirmAccountOpen(false);
      setPasswordResetOpen(true);
    }
  };

  // Handle confirm user into set new password
  const confirmClose = () => {
    setConfirmAccountOpen(false);
    console.log("Confirm close called. User:", resetID, secQuestions);
    if (resetID === null || secQuestions.length === 0) {
      return;
    } else {
      setPasswordResetOpen(true);
    }
  };

  // Handle password modal close and transition to security questions modal
  const handlePasswordClose = (enteredPassword) => {
    setPasswordResetOpen(false);
    if (enteredPassword === null) {
      return;
    }
    setNewPass(enteredPassword);
    setSecurityQuestionsOpen(true);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-white">
        {/* Header */}
        <div className="w-full h-24 left-0 top-0 pl-[20px] bg-[#A5907E] flex items-row justify-between">
          <span className="text-white text-6xl font-['Roboto']">BiteSync</span>
        </div>

        {/* Outer Dash Box */}
        <div className="flex flex-col items-center justify-center flex-grow p-4 w-[80%] bg-[#F4EFE9]">
          <div id="wakeup">
            <p>Connecting to Server...</p>
          </div>
          {/* Inner Dash Box */}
          <div className="bg-white w-[90%] p-8 rounded-lg overflow-auto font-['Inter']">
            <h1 className="text-4xl font-semibold mb-6 text-center">Login</h1>
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

              {/* Password Input */}
              <div>Password</div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={127}
                onKeyDown={(e) => {
                  // Handle Enter key for login
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-500 mt-2 text-center">{error}</div>
            )}

            {/* Buttons */}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleLogin}
                className="w-[50%] mt-6 p-3 bg-[#746056] text-white rounded-lg hover:bg-[#54463e] transition duration-200"
              >
                Login
              </button>
              <Link
                to="/create-account"
                className="w-[50%] mt-6 p-3 bg-[#746056] text-white rounded-lg hover:bg-[#54463e] transition duration-200 text-center"
              >
                Create Account
              </Link>
              <button
                onClick={() => setConfirmAccountOpen(true)}
                className="w-[50%] mt-6 p-3 bg-[#746056] text-white rounded-lg hover:bg-[#54463e] transition duration-200 text-center"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <ContactBar />
      </div>
      <Modal isOpen={confirmAccountOpen} onClose={() => confirmClose()}>
        <ConfirmAccount setUser={handleConfirmAccount} />
      </Modal>

      <Modal
        isOpen={passwordResetOpen}
        onClose={() => setPasswordResetOpen(false)}
      >
        <NewPassword setPassword={handlePasswordClose} />
      </Modal>

      <Modal
        isOpen={securityQuestionsOpen}
        onClose={() => setSecurityQuestionsOpen(false)}
      >
        <SecQuestion
          questionIndexes={secQuestions}
          newPassword={newPass}
          accountID={resetID}
        />
      </Modal>

      {/* Warning Modal */}
      <Modal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
      >
        This app is best viewed on a larger screen. Some features may be
        incomplete or limited on smaller screens.
        <br />
        Please use a tablet or desktop for the best experience.
        <br />
        Configuration of mobile features is a future goal of this project and is
        in development. Please be patient and check back later. Thank you!
      </Modal>
    </>
  );
}

export default Login;
