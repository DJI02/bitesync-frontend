import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../utils/api";
import SearchBar from "../SearchBar";

function RecipeAdmin({ setError }) {
  const [openRecipes, setOpenRecipes] = useState(true);
  const [recipes, setRecipes] = useState([]); // State to hold the list of recipes
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  //   Gets the recipe on mount
  useEffect(() => {
    (async () => {
      try {
        const recipeData = await authenticatedFetch("/recipe-book/all");
        setRecipes(recipeData);
        setSearchedRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLocalError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [setError]);

  //   Delete Recipe
  const deleteRecipe = async (recipe, index) => {
    try {
      await authenticatedFetch(`/recipe-mgr/delete`, {
        method: "DELETE",
        data: {
          accountID: localStorage.getItem("userId"),
          id: recipe.id,
        },
      });

      setRecipes((prevRecipes) => prevRecipes.filter((_, i) => i !== index));
      setSearchedRecipes((prevRecipes) =>
        prevRecipes.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError(error.message, "deleting recipe");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className={`p-2 bg-[#746056] text-white ${
          openRecipes ? "rounded-t-lg" : "rounded-lg"
        }`}
        onClick={() => setOpenRecipes(!openRecipes)}
      >
        {openRecipes ? "Hide" : "Show"} recipe
      </button>

      {openRecipes && (
        <div className="rounded-b-lg bg-[#F4EFE9] px-2 w-full">
          {recipes.length > 0 && !loading && (
            <SearchBar
              list={recipes}
              setModifiedList={setSearchedRecipes}
              modifier={"name"}
            />
          )}
          {loading ? (
            <p>Loading...</p>
          ) : localError ? (
            <p className="p-2">
              Error fetching recipes. Please try again later.
            </p>
          ) : searchedRecipes.length > 0 ? (
            searchedRecipes.map((recipe, index) => (
              <>
                {/* Card for each recipe */}
                <div
                  className="flex flex-row w-full justify-between items-center p-1 h-10"
                  key={index}
                >
                  <div className="w-[40%] overflow-auto no-scrollbar whitespace-nowrap">
                    <p>{recipe.name}</p>
                  </div>
                  <div className="w-[30%] overflow-auto no-scrollbar whitespace-nowrap text-start p-4">
                    <p>Created By: {recipe.author}</p>
                  </div>
                  <div className="flex w-[30%] justify-end items-center">
                    <button
                      className="bg-red-500 text-white rounded px-2 w-[75px]"
                      onClick={() => deleteRecipe(recipe, index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className={`border-b ${
                    index === recipe.length - 1 ? "" : "border-gray-400 pt-1"
                  } w-full`}
                />
              </>
            ))
          ) : (
            <p className="p-2">No recipe found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeAdmin;
