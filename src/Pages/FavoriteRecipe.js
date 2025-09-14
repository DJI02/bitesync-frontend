import {
  NavBar,
  ContactBar,
  SearchBar,
  RecipeCard,
  PageNumberBar,
} from "../Components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";

function FavoriteRecipe() {
  const favoriteRecipes = JSON.parse(localStorage.getItem("favorites")) || []; // Gets the favorite recipes from local storage, or an empty array if none exist
  const [searchedRecipes, setSearchedRecipes] = useState(favoriteRecipes); // State to hold searched recipes
  const [category, setCategory] = useState("name"); // State to manage the selected category for searching recipes
  const [pageNumber, setPageNumber] = useState(1); // State to manage pagination, if needed
  const maxCardsPerPage = 10; // Maximum number of cards to display per page

  // Hold states for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fectches the favorite recipies again to ensure they are up to date
  useEffect(() => {
    (async () => {
      try {
        const favoriteData = await authenticatedFetch(
          `/recipe-book/favorites?accountID=${localStorage.getItem("userId")}`,
          {
            method: "POST",
          }
        );
        if (favoriteData) {
          localStorage.setItem("favorites", JSON.stringify(favoriteData));
          setSearchedRecipes(favoriteData);
        }
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        setError("Failed to fetch favorite recipes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const favoriteRecipes =
      JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    console.log("Parsed favorite recipes:", favoriteRecipes);
  }, []);

  return (
    // Background
    <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
      {/* Nav Bar */}
      <NavBar />
      {/* Outer Dash Box */}
      <div
        className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-3 font-['Inter'] pb-7"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        <h1 className="text-4xl w-full pl-[5%] text-left mt-5">
          Favorite Recipe Book
        </h1>
        {/* Recipe Book Header */}
        <div className="w-[90%] flex flex-row items-center justify-between">
          {/* Search Bar and Category Selector */}
          <div className="flex flex-row items-center">
            <SearchBar
              list={favoriteRecipes}
              modifier={category}
              setModifiedList={setSearchedRecipes}
            />
            <select
              className="bg-[#746056] text-white rounded-lg p-2 w-[150px] text-center"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSearchedRecipes(favoriteRecipes);
              }}
            >
              <option value="name">Name</option>
              <option value="author">Creator</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center h-full">
            <p>Loading recipes...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-[90%] items-center justify-center">
              {searchedRecipes.length > 0 ? (
                searchedRecipes
                  .slice(
                    (pageNumber - 1) * maxCardsPerPage,
                    pageNumber * maxCardsPerPage
                  )
                  .map((recipe) => (
                    <Link
                      className="w-full flex justify-center"
                      to={`/recipe/${recipe.id}`}
                      key={recipe.id}
                    >
                      <RecipeCard recipe={recipe} />
                    </Link>
                  ))
              ) : (
                <p className="text-center py-4">No favorite recipes found.</p>
              )}
            </div>
            <PageNumberBar
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalPages={Math.ceil(searchedRecipes.length / maxCardsPerPage)}
            />
          </>
        )}
      </div>
      {/* Contact Bar */}
      <div className="bottom-0 w-full">
        <ContactBar />
      </div>
    </div>
  );
}

export default FavoriteRecipe;
