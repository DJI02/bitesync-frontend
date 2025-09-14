import { useState } from "react";
import { NavBar, ContactBar, SearchBar, PageNumberBar } from "../Components";
import { useEffect } from "react";
import { authenticatedFetch } from "../utils/api";
import EventCard from "../Components/Event/EventCard";
import { useNavigate } from "react-router-dom";

function EventList() {
  // States to hold events and manage search/filtering
  const [events, setEvents] = useState([]); // State to hold the list of events
  const [archivedEvents, setArchivedEvents] = useState([]); // State to hold archived events
  const [eventsToSearch, setEventsToSearch] = useState([]); // State to hold the current list of events to search/filter
  const [searchedEvents, setSearchedEvents] = useState([]); // State to hold the searched events for the search bar

  // Pagination states
  const [pageNumber, setPageNumber] = useState(1); // State to manage pagination
  const maxCardsPerPage = 10; // Maximum number of cards to display per page

  // Handle loading/error states
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages

  // Navigator
  const navigator = useNavigate();

  // Fetch both events and archived events
  useEffect(() => {
    (async () => {
      try {
        const [eventsRes, archivedRes] = await Promise.all([
          authenticatedFetch("/event-list/all"),
          authenticatedFetch("event-list/archive"),
        ]);

        // Set the fetched events to state
        setEvents(eventsRes);
        setArchivedEvents(archivedRes);

        // Set the events to search with all events
        setEventsToSearch(eventsRes);
        setSearchedEvents(eventsRes);
      } catch (error) {
        console.error("Error fetching events or archived events:", error);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
      {/* Nav Bar */}
      <NavBar />
      {/* Box */}
      <div
        className="w-[80%] flex flex-grow flex-col items-center p-4 overflow-hide font-['Inter']"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        <h1 className="text-4xl w-full pl-[5%] text-left mt-5 mb-3">
          Event List
        </h1>

        {/* Search Bar */}
        <div className="w-[90%] flex flex-row items-center justify-between">
          {/* Only gets the name of the event (given there will be few events) */}
          <div className="flex flex-row items-center">
            <SearchBar
              list={eventsToSearch}
              modifier={"name"}
              setModifiedList={setSearchedEvents}
            />

            {/* Allows filtering by ongoing or past events tbd */}
            <select
              className="bg-[#746056] text-white rounded-lg p-2 w-[150px] text-center"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "ongoing") {
                  setEventsToSearch(events);
                  setSearchedEvents(events);
                } else {
                  setEventsToSearch(archivedEvents);
                  setSearchedEvents(archivedEvents);
                }
              }}
            >
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
          </div>

          <button
            className="bg-[#746056] text-white rounded-lg p-2 w-[150px] text-center"
            onClick={() => {
              navigator("/create-events");
            }}
          >
            Create Event
          </button>
        </div>

        {/* List of Event Cards */}
        <div className="flex flex-col gap-4 w-[90%] items-center justify-center mt-3">
          {loading ? (
            <p className="text-center py-4">Loading Events...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : searchedEvents.length > 0 ? (
            searchedEvents
              .slice(
                (pageNumber - 1) * maxCardsPerPage,
                pageNumber * maxCardsPerPage
              )
              .map((event, index) => <EventCard key={index} event={event} />)
          ) : (
            <p className="text-center py-4">No events found.</p>
          )}
        </div>
        <PageNumberBar
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={Math.ceil(searchedEvents.length / maxCardsPerPage)}
        />
      </div>

      {/* Contact Bar */}
      <div className="bottom-0 w-full">
        <ContactBar />
      </div>
    </div>
  );
}

export default EventList;
