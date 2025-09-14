import React, { useState, useEffect } from "react";
import { authenticatedFetch } from "../../utils/api";
import SearchBar from "../SearchBar";
import MiniRecipeCard from "../Event/MiniRecipeCard";
import PageNumberBar from "../PageNumberBar";
import { useNavigate } from "react-router-dom";

function Register({ userRecipes, eventID }) {
  const navigate = useNavigate();

  const [recipesToRegister, setRegisteredRecipes] = useState(
    userRecipes
      ? [eventID, localStorage.getItem("userId"), ...userRecipes]
      : [eventID, localStorage.getItem("userId")]
  ); // State to hold recipes to register, initialized with user recipes if available (from the event page)
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state and display error messages in UI
  const [recipes, setRecipes] = useState([]); // State to hold all recipes
  const [searchedRecipes, setSearchedRecipes] = useState([]); // State to hold searched recipes for the search bar
  const [pageNumber, setPageNumber] = useState(1); // State to manage pagination
  const maxCardsPerPage = 15; // Maximum number of cards to display per page

  // Toggle dropdowns
  const [customItemDropdown, setCustomItemDropdown] = useState(true);
  const [recipeDropdown, setRecipeDropdown] = useState(true);

  // Either creates a registration or updates the existing one
  const handleRegister = () => {
    (async () => {
      try {
        await authenticatedFetch("/event-list/join", {
          method: "PUT",
          data: recipesToRegister,
        });
        if (window.location.pathname === `/view-event/${eventID}`) {
          window.location.reload();
        } else {
          navigate(`/view-event/${eventID}`);
        }
      } catch (error) {
        console.error("Error registering for event:", error);
      }
    })();
  };

  // Fetches all recipes from the server
  useEffect(() => {
    (async () => {
      try {
        const recipeData = await authenticatedFetch("/recipe-book/all");
        setRecipes(recipeData);
        setSearchedRecipes(recipeData);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Function to remove a recipe from the registered recipes
  // With recipes stored as [ID, name], checks if the next item in the array is the recipe to be removed and then removes it and the one following it
  const removeRecipe = (recipe) => {
    setRegisteredRecipes(
      recipesToRegister.filter((r, idx, arr) => {
        if (arr[idx + 1] === recipe) {
          return false;
        }
        if (r === recipe) {
          return false;
        }
        return true;
      })
    );
  };

  // Concats a new recipe to the registered recipes if it doesn't already exist
  const addRecipe = (recipe) => {
    if (!recipesToRegister.includes(recipe)) {
      setRegisteredRecipes([...recipesToRegister, "~", recipe]);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-start gap-2">
      {/* Title box */}
      <div
        className="h-[60px] w-[90%] p-4 rounded-lg shadow-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Select Recipes to Register
      </div>
      <button
        onClick={handleRegister}
        className="bg-[#A5907E] text-white px-4 py-2 rounded-lg"
      >
        Register
      </button>

      {/* Displaying registered recipes */}
      <div className="bg-white flex flex-row flex-wrap items-center justify-center w-[90%] gap-x-2">
        {recipesToRegister
          .filter((_, idx) => idx >= 3 && idx % 2 === 1)
          .map((recipe, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between break-words bg-[#ede6dd] border-gray-200 p-2 rounded-lg mb-2"
            >
              <div className="border-r-8 max-w-[25ch] overflow-auto text-ellipsis whitespace-nowrap">
                {recipe}
              </div>
              <button
                className=""
                onClick={() => {
                  removeRecipe(recipe);
                }}
              >
                X
              </button>
            </div>
          ))}
      </div>

      {/* Dropdown for custom item */}
      <div className="flex flex-col w-[90%]">
        <button
          onClick={() => setCustomItemDropdown(!customItemDropdown)}
          className={`bg-[#A5907E] text-white text-start px-4 py-2 flex items-center justify-between ${
            customItemDropdown ? "rounded-t-lg" : "rounded-lg"
          }`}
        >
          {customItemDropdown ? "Hide Custom Entry" : "Add Custom Entry"}
          <span className="ml-2 text-lg">{customItemDropdown ? "-" : "+"}</span>
        </button>
        {customItemDropdown && (
          <div className="bg-white border border-gray-300 rounded-b-lg shadow-lg">
            <div className="p-2 bg-[#F4EFE9]">
              <input
                type="text"
                placeholder="Add a custom entry"
                className="border border-grey-300 p-2 rounded-md w-full"
                maxLength={100}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    addRecipe(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recipe Selection */}
      <div className="flex flex-col w-[90%]">
        <button
          onClick={() => setRecipeDropdown(!recipeDropdown)}
          className={`bg-[#A5907E] text-white text-start px-4 py-2 flex items-center justify-between ${
            recipeDropdown ? "rounded-t-lg" : "rounded-lg"
          }`}
        >
          {recipeDropdown ? "Hide Recipe Selection" : "Add from Recipe List"}
          <span className="ml-2 text-lg">{recipeDropdown ? "-" : "+"}</span>
        </button>
        {recipeDropdown && (
          <div className="bg-white border border-gray-300 rounded-b-lg shadow-lg">
            <div className="p-2 bg-[#F4EFE9]">
              <div className="pt-3 w-full items-center justify-center flex border-t-[1px] border-grey-700 border-solid flex-col">
                <SearchBar
                  list={recipes}
                  modifier={"name"}
                  setModifiedList={setSearchedRecipes}
                />
                {loading ? (
                  <div className="text-center py-4">
                    <p>Loading...</p>
                  </div>
                ) : searchedRecipes.length > 0 ? (
                  <>
                    <div className="p-2 w-full items-center justify-center flex border-t-[1px] border-grey-700 border-solid flex-col gap-1">
                      {searchedRecipes
                        .slice(
                          (pageNumber - 1) * maxCardsPerPage,
                          pageNumber * maxCardsPerPage
                        )
                        .map((recipe) => (
                          <div className="w-full bg-white rounded-lg">
                            <MiniRecipeCard
                              key={recipe.id}
                              recipe={recipe}
                              setRegisteredRecipes={setRegisteredRecipes}
                              recipesToRegister={recipesToRegister}
                            />
                          </div>
                        ))}
                    </div>
                  </>
                ) : error ? (
                  <div className="text-center py-4">
                    <p>An error occured while fetching the recipes</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>No recipes found</p>
                  </div>
                )}
                <PageNumberBar
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalPages={Math.ceil(
                    searchedRecipes.length / maxCardsPerPage
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
