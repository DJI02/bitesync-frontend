import {
  NavBar,
  ContactBar,
  RecipeCard,
  SearchBar,
  PageNumberBar,
} from "../Components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";

function RecipeBook() {
  // Recipe States
  const [recipes, setRecipes] = useState([]); // State to hold all recipes
  const [searchedRecipes, setSearchedRecipes] = useState([]); // State to hold searched recipes

  // Search and Pagination States
  const [category, setCategory] = useState("name"); // State to manage the selected category for searching
  const [pageNumber, setPageNumber] = useState(1); // State to manage pagination, if needed
  const maxCardsPerPage = 10; // Maximum number of cards to display per page

  // Navigation
  const navigator = useNavigate();

  // Loading and Error States
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state and display error messages in UI

  // Fetches all recipes from the server
  useEffect(() => {
    (async () => {
      try {
        const recipeData = await authenticatedFetch("/recipe-book/all");
        await setRecipes(recipeData);
        await setSearchedRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    // Background
    <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Nav Bar */}
      <NavBar />
      {/* Outer Dash Box */}
      <div
        className="flex flex-col items-center flex-grow p-4 w-[80%] gap-3 font-['Inter'] pb-7"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        <h1 className="text-4xl w-full pl-[5%] text-left mt-5">Recipe Book</h1>

        {/* Recipe Book Header */}
        <div className="w-[90%] flex flex-row items-center justify-between">
          {/* Search Bar and Category Selector */}
          <div className="flex flex-row items-center">
            <SearchBar
              list={recipes}
              modifier={category}
              setModifiedList={setSearchedRecipes}
            />
            <select
              className="bg-[#746056] text-white rounded-lg p-2 w-[150px] text-center"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSearchedRecipes(recipes);
              }}
            >
              <option value="name">Name</option>
              <option value="author">Creator</option>
            </select>
          </div>

          {/* Create Recipe Button, redirects to create recipe page */}
          <button
            className="bg-[#746056] text-white rounded-lg p-2 w-[150px] text-center"
            onClick={() => {
              navigator("/create-recipe");
            }}
          >
            Create Recipe
          </button>
        </div>

        {/* Recipe Cards */}
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          {loading ? (
            <p className="text-center py-4">Loading recipes...</p>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>{error}</p>
              <p className="mt-2">Please try logging in again.</p>
            </div>
          ) : searchedRecipes.length > 0 ? (
            <div className="flex flex-col gap-4 w-[90%] items-center justify-center">
              {searchedRecipes
                .slice(
                  (pageNumber - 1) * maxCardsPerPage,
                  pageNumber * maxCardsPerPage
                )
                .map((recipe, index) => (
                  <RecipeCard key={recipe.id || index} recipe={recipe} />
                ))}
            </div>
          ) : (
            <p className="text-center py-4">No recipes found.</p>
          )}
        </div>
        {loading || error ? null : (
          <PageNumberBar
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalPages={Math.ceil(searchedRecipes.length / maxCardsPerPage)}
          />
        )}
      </div>

      {/* Contact Bar */}
      <div className="bottom-0 w-full">
        <ContactBar />
      </div>
    </div>
  );
}

export default RecipeBook;
