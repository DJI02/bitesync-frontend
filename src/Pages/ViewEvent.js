import {
  NavBar,
  ContactBar,
  AttendeeDisplay,
  EventButtons,
} from "../Components";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../api";

function ViewEvent() {
  const { eventID } = useParams(); // Get the eventID from the URL parameters
  const [event, setEvent] = useState(); // State to hold the event data
  const [attending, setAttending] = useState(false); // State to check if the user is attending the event
  const [userRecipes, setUserRecipes] = useState([]); // State to hold the current user's recipes (to pass to Register component)
  const [allAllergies, setAllAllergies] = useState([]); // State to hold all users allergies

  // Loading and error state
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to hold any error messages

  // Fetches the event data from the server
  useEffect(() => {
    (async () => {
      try {
        const data = await api.post(`event-list/view?eventID=${eventID}`);
        const eventData = await data.data;
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError(error);
        setLoading(false);
      }
    })();
  }, [eventID]);

  //Checks if the user is attending the event
  useEffect(() => {
    if (attending || !localStorage.getItem("userId")) return; //If already attending, no need to check again
    if (!event || !event.participants) {
      return;
    }
    setAttending(
      event?.participants?.some(
        (participant) =>
          participant[0] === localStorage.getItem("userId") &&
          (setUserRecipes(participant.filter((_, idx) => idx > 0) || []), true)
      )
    );
  }, [event, event?.participants, attending, userRecipes]);

  return (
    <>
      {/* Background */}
      <div className="min-h-screen flex flex-col items-center bg-white overflow-auto w-full">
        {/* Nav */}
        <NavBar />

        {/* Outer Dash Box */}
        <div
          className="flex flex-row flex-grow items-start justify-top pt-10 w-[80%] gap-3 font-['Inter'] mp-2"
          style={{ backgroundColor: "#F4EFE9" }}
        >
          {/* Event Details */}
          <div className="flex flex-col gap-q items-start justify-start min-w-[30%] p-6">
            <h1 className="text-4xl font-bold mb-4 overflow-hidden break-all whitespace-normal w-full">
              {loading ? "Loading..." : error ? "Error" : event?.name}
            </h1>
            <p className="text-md mb-2">
              {loading || error ? null : "Hosted by: " + event?.author}
            </p>
            <p className="text-md mb-2">
              {loading || error
                ? null
                : "The event will be: " + event?.dateAndTime}
            </p>

            {/* Description of event */}
            <div className="text-md mb-2">
              {loading || error ? null : event?.description ? (
                event.description.split("\n").map((description, index) => (
                  <React.Fragment key={index}>
                    {description}
                    <br />
                  </React.Fragment>
                ))
              ) : (
                <div className="text-sm text-start text-gray-600">
                  No Description Given
                </div>
              )}

              {/* Allergies */}
              <div className="text-md my-2">
                {allAllergies.length > 0 ? (
                  <>
                    <span>Most Common Allergies: </span>
                    {allAllergies
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map((allergy, index) => (
                        <span key={index}>
                          <br />
                          {allergy[1]} allergy to {allergy[0]}
                          {index < allAllergies.length - 1 ? " " : ""}
                        </span>
                      ))}
                  </>
                ) : (
                  <span>{"\u00A0"}</span>
                )}
              </div>
            </div>

            {/* Event Buttons */}
            <EventButtons
              loading={loading}
              error={error}
              userAllergies={allAllergies}
              userRecipes={userRecipes}
              event={event}
            />
          </div>

          {/* Attendees, right side box */}
          <AttendeeDisplay
            participants={event?.participants}
            error={error}
            passAllAllergies={setAllAllergies}
          />
        </div>

        {/* Contact Bar */}
        <div className="bottom-0 w-full">
          <ContactBar />
        </div>
      </div>
    </>
  );
}

export default ViewEvent;
