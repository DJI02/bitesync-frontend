import {
  NavBar,
  ContactBar,
  Modal,
  NewVal,
  SecQuestion,
  NewPassword,
} from "../Components";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";

function Profile() {
  // Modal Control States
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  // Allergy Management
  const [allergy, setAllergy] = useState("");
  const [allergies, setAllergies] = useState([]);

  // Password Management
  const [questions, setQuestions] = useState([]);
  const [newPassword, setNewPassword] = useState(null);

  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch account information on mount
  useEffect(() => {
    (async () => {
      try {
        const accountData = await authenticatedFetch(
          `/account-mgr/info?accountID=${localStorage.getItem("userId")}`,
          {
            method: "POST",
          }
        );
        setAllergies(accountData?.tags || []);
        setQuestions(accountData?.secQ || []);
      } catch (error) {
        console.error("Error fetching account info:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //Updates tags when they change. Needed so that the tags are saved to allergies before being entered into the database
  useEffect(() => {
    (async () => {
      try {
        await authenticatedFetch(`/account-mgr/tags`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: localStorage.getItem("userId"),
            tags: allergies,
          },
        });
      } catch (error) {
        console.error("Error updating tags:", error);
      }
    })();
  }, [allergies]);

  // Handles the entered password
  const handlePasswordClose = (enteredPassword) => {
    setPasswordOpen(false);
    if (enteredPassword === null) {
      return;
    }
    setNewPassword(enteredPassword);
    setSecurityOpen(true);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
        {/* Nav Bar */}
        <NavBar />
        {/* Box */}
        <div
          className="w-[80%] flex flex-grow flex-col items-center p-4 overflow-hide justify-center"
          style={{ backgroundColor: "#F4EFE9" }}
        >
          <p className="text-4xl font-bold mb-4 text-center font-['Inter']">
            Profile
          </p>
          {/* Box with the profile information/editing boxes */}
          <div
            className="w-[45%] p-2 rounded-lg mt-10 flex flex-col items-center gap-5"
            style={{ backgroundColor: "#786452" }}
          >
            {/* Name Card */}
            <div className="bg-white w-full rounded-xl flex flex-col items-center gap-2 p-2">
              <p> Name: </p>
              <p className="text-blue-950">
                {error
                  ? "Error loading account"
                  : loading
                  ? "Loading..."
                  : localStorage.getItem("userName")}
              </p>
            </div>
            {/* Edit Name/Password */}
            <div className="bg-white w-full rounded-xl flex flex-row items-center gap-2 p-2">
              <button
                className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200 w-full"
                onClick={() => {
                  if (!error && !loading) {
                    setUsernameOpen(true);
                  }
                }}
              >
                Edit Name
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200 w-full"
                onClick={() => {
                  if (!error && !loading) {
                    setPasswordOpen(true);
                  }
                }}
              >
                Change Password
              </button>
            </div>
            {/* Add Account Allergy Tags */}
            <div className="bg-white w-full rounded-xl flex flex-col items-center gap-2 p-2">
              <p> Allergies: </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {error ? null : loading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    {allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {allergy}
                        <button
                          onClick={() => {
                            setAllergies(
                              allergies.filter((a) => a !== allergy)
                            );
                          }}
                          className="ml-2 text-red-500"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <div className="flex flex-row items-center">
                      <input
                        type="text"
                        value={allergy}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            allergy.trim() &&
                            !allergies.some(
                              (a) =>
                                a.toLowerCase() === allergy.trim().toLowerCase()
                            )
                          ) {
                            setAllergies([...allergies, allergy.trim()]);
                            setAllergy("");
                          }
                        }}
                        onChange={(e) => setAllergy(e.target.value)}
                        placeholder="Add Allergy"
                        className="border border-gray-300 rounded-l-xl px-2 py-1 max-w-[200px] focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (
                            allergy.trim() &&
                            !allergies.some(
                              (a) =>
                                a.toLowerCase() === allergy.trim().toLowerCase()
                            )
                          ) {
                            setAllergies([...allergies, allergy.trim()]);
                            setAllergy("");
                          }
                        }}
                        className="text-white px-4 py-1 rounded-r-xl transition duration-200"
                        style={{ backgroundColor: "#786452" }}
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Contact Bar */}
        <div className="bottom-0 w-full">
          <ContactBar />
        </div>
      </div>
      <div className="w-full h-full">
        {/* Change Username Modal */}
        <Modal isOpen={usernameOpen} onClose={() => setUsernameOpen(false)}>
          <NewVal message="username" />
        </Modal>

        {/* Change Password Modals */}
        <Modal isOpen={passwordOpen} onClose={() => setPasswordOpen(false)}>
          <NewPassword setPassword={handlePasswordClose} />
        </Modal>
        <Modal isOpen={securityOpen} onClose={() => setSecurityOpen(false)}>
          <SecQuestion
            questionIndexes={questions}
            newPassword={newPassword}
            accountID={localStorage.getItem("userId")}
          />
        </Modal>
      </div>
    </>
  );
}

export default Profile;
