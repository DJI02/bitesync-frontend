import {
  ContactBar,
  EventAdmin,
  Modal,
  RegisterKeyModal,
  RecipeAdmin,
  AccountAdmin,
  ErrorModal,
} from "../Components";
import BiteSyncLogo from "../Pictures/BiteSyncLogo.webp";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminPage() {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Modal states
  const [registerKeyOpen, setRegisterKeyOpen] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorObject, setErrorObject] = useState("");

  const setError = (message, object) => {
    setRegisterKeyOpen(false);
    setErrorMessage(message);
    setErrorObject(object);
    setErrorModal(true);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
    setErrorMessage("");
    setErrorObject("");
  };

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "ADMIN") {
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-white">
        {/* Header */}
        <div className="w-full h-24 left-0 top-0 pl-[20px] bg-[#A5907E] flex flex-row items-center justify-between">
          <div className="text-white text-6xl font-['Roboto']">BiteSync</div>
          <img
            src={BiteSyncLogo}
            alt="BiteSync Logo"
            className="w-24 h-24"
            onClick={() => setLogoutOpen(!logoutOpen)}
          />
        </div>
        {/* Logout Popdown */}
        {logoutOpen && (
          <button
            className="absolute right-4 top-24 mt-2 w-48 bg-white border shadow-lg z-50 rounded-lg py-2 px-4 text-start"
            onClick={() => {
              setLogoutOpen(false);
              localStorage.removeItem("userName");
              localStorage.removeItem("userId");
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        )}

        {/* Outer Box */}
        <div className="flex flex-col items-center justify-start flex-grow p-4 w-[80%] bg-[#F4EFE9]">
          {/* Inner Box */}
          <div className="bg-white w-[90%] p-8 rounded-lg overflow-auto font-['Inter'] flex flex-col items-center gap-4">
            {/* Title and disclaimer */}
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold">
                {localStorage.getItem("userName")}'s Admin Dashboard
              </h2>
              <p className="text-sm text-gray-700">
                Welcome to the admin dashboard!
              </p>
              <p className="text-sm text-gray-700">
                Please be aware that this account is only to be used for admin
                purposes. Attempting to interact with non-admin features may
                result in unintended consequences.
              </p>
            </div>

            <button
              className="bg-[#A5907E] text-white rounded-lg p-2"
              onClick={() => setRegisterKeyOpen(true)}
            >
              Reset Registration Key
            </button>

            <RecipeAdmin setError={setError} />
            <EventAdmin setError={setError} />
            <AccountAdmin setError={setError} />
          </div>
        </div>

        {/* Contact Bar */}
        <ContactBar />
      </div>
      <Modal isOpen={registerKeyOpen} onClose={() => setRegisterKeyOpen(false)}>
        <RegisterKeyModal />
      </Modal>

      <Modal isOpen={errorModal} onClose={closeErrorModal}>
        <ErrorModal
          message={errorMessage}
          object={errorObject}
          onConfirm={closeErrorModal}
        />
      </Modal>
    </>
  );
}

export default AdminPage;
