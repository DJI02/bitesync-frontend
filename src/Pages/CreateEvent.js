import { NavBar, ContactBar, EventForm, Modal, Register } from "../Components";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [registerOpen, setRegisterOpen] = useState(false); // Allows for the creator of the recipe to register for the event immediatly after it has been created
  const [eventID, setEventID] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (eventID) {
      setRegisterOpen(true);
    }
  }, [eventID]);

  const handleRegisterClose = () => {
    setRegisterOpen(false);
    navigate(`/view-event/${eventID}`);
  };

  // Add logic to handle login check here
  const handleCreateEvent = async (event) => {
    //API CALL

    try {
      const eventData = await authenticatedFetch("/event-mgr/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          author: localStorage.getItem("userName"),
          accountID: localStorage.getItem("userId"),
          name: event.name,
          dateAndTime: event.dateAndTime,
          location: event.location,
          description: event.description,
        },
      });
      const eventID = eventData.split(" ").pop();
      setEventID(eventID);
    } catch (err) {
      console.log("Something wrong with createEvent:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
      <NavBar />

      {/* background */}
      <div
        className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-4"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter']">
          <h2 className="text-3xl font-bold text-center">Create Event</h2>
          <EventForm onSubmit={handleCreateEvent} />
        </div>
      </div>

      <Modal isOpen={registerOpen} onClose={() => handleRegisterClose()}>
        <Register eventID={eventID} />
      </Modal>

      <ContactBar />
    </div>
  );
}

export default CreateEvent;
