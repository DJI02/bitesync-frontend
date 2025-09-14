import { useEffect, useState } from "react";
import { authenticatedFetch } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Modal, AllergyModal, Register, ErrorModal } from "../index";

function EventButtons({ loading, error, userAllergies, userRecipes, event }) {
  // States
  const [allergyOpen, setAllergyOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [attending, setAttending] = useState(false);

  // Error Modal
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  // Navigation
  const navigator = useNavigate();

  // Check if the user is attending the event
  useEffect(() => {
    setAttending(
      event?.participants?.some(
        (participant) => participant[0] === localStorage.getItem("userId")
      ) || false
    );
  }, [event]);

  // Error handling
  const setError = async (message, object) => {
    setErrorMessage([message, object]);
    setErrorOpen(true);
  };

  const closeErrorModal = () => {
    setErrorOpen(false);
    setErrorMessage([]);
  };

  //   APIs
  const handleLeaveEvent = () => {
    (async () => {
      try {
        await authenticatedFetch("/event-list/leave", {
          method: "DELETE",
          data: [event?.id, localStorage.getItem("userId")],
        });
        window.location.reload();
      } catch (error) {
        console.error("Error leaving event:", error);
        setError(error.message, "leaving event");
      }
    })();
  };

  const archiveEvent = () => {
    (async () => {
      try {
        await authenticatedFetch("/event-mgr/archive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: event?.id,
            accountID: localStorage.getItem("userId"),
          },
        });
        window.location.reload();
      } catch (error) {
        console.error("Error archiving event:", error);
        setError(error.message, "archiving event");
      }
    })();
  };

  const unarchiveEvent = () => {
    (async () => {
      try {
        await authenticatedFetch("/event-mgr/unarchive", {
          method: "POST",
          data: {
            id: event?.id,
            accountID: localStorage.getItem("userId"),
          },
        });
        window.location.reload();
      } catch (error) {
        console.error("Error unarchiving event:", error);
        setError(error.message, "unarchiving event");
      }
    })();
  };

  const endEvent = async () => {
    try {
      await authenticatedFetch(`/event-mgr/delete`, {
        method: "DELETE",
        data: {
          accountID: localStorage.getItem("userId"),
          id: event?.id,
        },
      });
      navigator("/manage-events");
    } catch (error) {
      console.error("Error deleting:", error);
      setError(error.message, "deleting event");
    }
  };

  return (
    <>
      {/* If loading, error, or no event, show nothing */}
      {loading || error || !event ? null : event?.archive ? (
        // If the event is archived and the user is the owner, show unarchive and delete buttons
        event?.accountID === localStorage.getItem("userId") ? (
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={() => {
                unarchiveEvent();
              }}
              className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
            >
              Unarchive Event
            </button>
            <button
              onClick={() => {
                endEvent();
              }}
              className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
            >
              Delete Event
            </button>
          </div>
        ) : null
      ) : (
        // If the event is not archived, show the regular event action buttons
        <div className="flex flex-col gap-4 mt-4">
          {/* View Attendee Allergies */}
          {userAllergies.length > 0 ? (
            <button
              onClick={() => {
                setAllergyOpen(true);
              }}
              className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
            >
              Attendee Allergies
            </button>
          ) : null}

          {/* Edit/Delete Event Button, owner action */}
          {event?.accountID === localStorage.getItem("userId") && (
            <>
              <button
                onClick={() => {
                  navigator(`/edit-event`, { state: { event: event } });
                }}
                className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
              >
                Edit/Delete Event
              </button>

              <button
                onClick={archiveEvent}
                className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
              >
                Archive Event
              </button>
            </>
          )}

          {/* Register Button  */}
          <button
            onClick={() => setRegisterOpen(true)}
            className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
          >
            {attending ? "Edit Registration" : "Register for Event"}
          </button>

          {/* Leave Event Button */}
          {attending ? (
            <button
              onClick={() => {
                handleLeaveEvent();
              }}
              className="bg-[#7A5E48] text-white px-4 py-2 rounded hover:bg-[#644d3b]"
            >
              Leave Event
            </button>
          ) : (
            <div className="hidden" />
          )}
        </div>
      )}
      {/* Registration Modal */}
      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
        <Register userRecipes={userRecipes} eventID={event?.id} />
      </Modal>

      {/* Allergy Modal */}
      <Modal isOpen={allergyOpen} onClose={() => setAllergyOpen(false)}>
        <AllergyModal allergies={userAllergies} />
      </Modal>

      <Modal isOpen={errorOpen} onClose={() => closeErrorModal()}>
        <ErrorModal
          message={errorMessage[0]}
          object={errorMessage[1]}
          onConfirm={closeErrorModal}
        />
      </Modal>
    </>
  );
}

export default EventButtons;
