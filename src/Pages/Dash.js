import { NavBar, ContactBar, RecipeCard, EventCard } from "../Components";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";

function Dash() {
  const [recipes, setRecipes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, eventsRes] = await Promise.all([
          authenticatedFetch("/recipe-book/all", {
            method: "GET",
          }),
          authenticatedFetch("/event-list/all", {
            method: "GET",
          }),
        ]);
        setRecipes(recipesRes);
        setEvents(eventsRes);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Grabs three random recipes to display
  const randomRecipes = recipes.sort(() => 0.5 - Math.random()).slice(0, 3);
  const randomEvents = events.sort(() => 0.5 - Math.random()).slice(0, 1);

  return (
    // Background
    <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
      {/* Nav Bar */}
      <NavBar />

      {/* Outer Dash Box */}
      <div
        className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-4 font-['Inter']"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        <h1 className="text-4xl font-bold my-4 text-center">
          Welcome {localStorage.userName}!
        </h1>

        {/* Event Card */}
        <div className="flex flex-col gap-3 p-2 w-[90%]">
          <div className="text-lg justify-start text-left">Events</div>
          {error ? (
            <>
              <p>Error loading events: {error.message}</p>
            </>
          ) : loading ? (
            <p>Loading events...</p>
          ) : (
            <>
              {events && events.length > 0 ? (
                randomEvents.map((event, index) => (
                  <EventCard event={event} key={index} />
                ))
              ) : (
                <p> No Current Events Planned</p>
              )}
            </>
          )}
        </div>

        {/* Recipe Card */}
        <div className="flex flex-col gap-3 p-2 w-[90%]">
          <div className="text-lg justify-start text-left">Recipes</div>
          {loading ? (
            <p>Loading recipes...</p>
          ) : error ? (
            <p>Error loading recipes: {error.message}</p>
          ) : (
            <>
              {randomRecipes.map((recipe) => (
                <RecipeCard recipe={recipe} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Contact Bar */}
      <ContactBar />
    </div>
  );
}

export default Dash;
