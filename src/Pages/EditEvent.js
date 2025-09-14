import {
  NavBar,
  ContactBar,
  EventForm,
  Confirm,
  Modal,
  ErrorModal,
} from "../Components";
import { useNavigate, useLocation } from "react-router-dom";
import { authenticatedFetch } from "../utils/api";
import { useEffect, useState } from "react";

function EditEvent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const eventObj = state?.event;

  // Modal States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]); // Error message state

  // Error handling
  const setError = (message, object) => {
    setErrorMessage([message, object]);
    setErrorOpen(true);
  };

  const closeErrorModal = () => {
    setErrorOpen(false);
    setErrorMessage([]);
  };

  useEffect(() => {
    if (!eventObj) {
      console.error("No event data found in state");
      navigate("/manage-events");
    }
  }, [eventObj, navigate]);

  // Error message handling for form submission
  useEffect(() => {
    if (errorMessage.length === 1) {
      const timer = setTimeout(() => {
        setErrorMessage([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Add logic to handle login check here
  const handleEditEvent = async (event) => {
    //API CALL

    try {
      await authenticatedFetch("/event-mgr/edit", {
        method: "PUT",
        data: {
          id: eventObj.id,
          author: localStorage.getItem("userName"),
          accountID: localStorage.getItem("userId"),
          name: event.name,
          dateAndTime: event.dateAndTime,
          location: event.location,
          description: event.description,
        },
      });
      navigate("/manage-events");
    } catch (error) {
      console.log("Something wrong with editEvent:", error);
      setErrorMessage([error.message]);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await authenticatedFetch(`/event-mgr/delete`, {
        method: "DELETE",
        data: {
          accountID: localStorage.getItem("userId"),
          id: eventObj.id,
        },
      });
      navigate("/manage-events");
    } catch (error) {
      console.error("Error deleting:", error);
      setConfirmOpen(false);
      setError(error.message, "deleting event");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
        <NavBar />

        {/* background */}
        <div
          className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-4"
          style={{ backgroundColor: "#F4EFE9" }}
        >
          <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter'] relative">
            <div className="flex flex-row justify-between mb-4">
              <div className="flex items-center w-[75px]"> </div>
              <h2 className="text-3xl font-bold text-center">Edit Event</h2>
              <button
                onClick={() => setConfirmOpen(true)}
                className="bg-[#7A5E48] text-white px-4 py-2 rounded-lg w-[75px]"
              >
                Delete
              </button>
            </div>
            <EventForm
              onSubmit={handleEditEvent}
              oldEvent={eventObj}
              error={errorMessage.length === 1 ? errorMessage[0] : null}
            />
          </div>
        </div>
        <ContactBar />
      </div>

      {/* Modals */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Confirm
          message="Are you sure you want to delete this event?"
          onConfirm={handleDeleteEvent}
          onCancel={() => setConfirmOpen(false)}
        />
      </Modal>
      <Modal isOpen={errorOpen} onClose={() => closeErrorModal()}>
        <ErrorModal
          message={errorMessage[0]}
          object={errorMessage[1]}
          onConfirm={() => closeErrorModal()}
        />
      </Modal>
    </>
  );
}

export default EditEvent;
