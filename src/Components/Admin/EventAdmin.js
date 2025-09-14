import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../utils/api";
import SearchBar from "../SearchBar";

function EventAdmin({ setError }) {
  const [openEvents, setOpenEvents] = useState(true);
  const [events, setEvents] = useState([]); // State to hold the list of events
  const [searchedEvents, setSearchedEvents] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  //   Gets the events on mount
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const [activeEvents, archivedEvents] = await Promise.all([
          authenticatedFetch("/event-list/all"),
          authenticatedFetch("/event-list/archive", {
            method: "GET",
          }),
        ]);
        const allEvents = [...activeEvents, ...archivedEvents];
        setEvents(allEvents);
        setSearchedEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLocalError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, [setError]);

  //   Delete Event
  const deleteEvent = async (eventObj, index) => {
    try {
      await authenticatedFetch(`/event-mgr/delete`, {
        method: "DELETE",
        data: {
          accountID: localStorage.getItem("userId"),
          id: eventObj.id,
        },
      });
      setEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));
      setSearchedEvents((prevEvents) =>
        prevEvents.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      setError(error.message, "deleting event");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className={`p-2 bg-[#746056] text-white ${
          openEvents ? "rounded-t-lg" : "rounded-lg"
        }`}
        onClick={() => setOpenEvents(!openEvents)}
      >
        {openEvents ? "Hide" : "Show"} Events
      </button>
      {openEvents && (
        <div className="rounded-b-lg bg-[#F4EFE9] px-2 w-full">
          {events.length > 0 && !loading && (
            <SearchBar
              list={events}
              setModifiedList={setSearchedEvents}
              modifier={"name"}
            />
          )}
          {loading ? (
            <p>Loading...</p>
          ) : localError ? (
            <p className="p-2">
              Error fetching events. Please try again later.
            </p>
          ) : searchedEvents.length > 0 ? (
            searchedEvents.map((event, index) => (
              <>
                {/* Card for each event */}
                <div
                  className="flex flex-row w-full justify-between items-center p-1 h-10"
                  key={index}
                >
                  <div className="w-[40%] overflow-auto no-scrollbar whitespace-nowrap">
                    <p>{event.name}</p>
                  </div>
                  <div className="w-[30%] overflow-auto no-scrollbar whitespace-nowrap text-start p-4">
                    <p>Created By: {event.author}</p>
                  </div>
                  <div className="flex w-[30%] justify-end items-center">
                    <button
                      className="bg-red-500 text-white rounded px-2 w-[75px]"
                      onClick={() => deleteEvent(event, index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className={`border-b ${
                    index === events.length - 1 ? "" : "border-gray-400 pt-1"
                  } w-full`}
                />
              </>
            ))
          ) : (
            <p className="p-2">No events found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default EventAdmin;
