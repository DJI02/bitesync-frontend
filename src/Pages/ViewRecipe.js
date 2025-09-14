import React, { useEffect, useState } from "react";
import { NavBar, ContactBar, AllergyTag } from "../Components";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { authenticatedFetch } from "../utils/api";

function ViewRecipe() {
  const [favoriteRecipes, setFavoriteRecipes] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(false); // State to manage error
  const [favError, setFavError] = useState(false); // State to manage favorite error

  const navigate = useNavigate();

  // Handle printing the recipe
  const handlePrint = () => {
    console.log("Printing recipe...");
    window.print();
  };

  const { recipeID } = useParams();

  const [recipe, setRecipe] = useState();

  // Fetch recipe data on mount from ID in url
  useEffect(() => {
    (async () => {
      try {
        const data = await api.post(`/recipe-book/view?recipeID=${recipeID}`);
        const recipeData = await data.data;
        setRecipe(recipeData);
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.some((fav) => fav.id === recipeID)) {
          setFavoriteRecipes(true);
        } else {
          setFavoriteRecipes(false);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [recipeID]);

  // Handles when the favorite/unfavorite button is clicked
  const handleFavoriteToggle = () => {
    (async () => {
      if (favoriteRecipes) {
        try {
          await authenticatedFetch(`/recipe-book/unfavorite`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              accountID: localStorage.getItem("userId"),
              id: recipe.id,
            },
          });
          const updatedFavorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
          ).filter((fav) => fav.id !== recipe.id);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setFavoriteRecipes(false);
        } catch (error) {
          console.error("Error removing recipe from favorites:", error);
          setFavError(true);
        }
      } else {
        // Add to favorites
        try {
          await authenticatedFetch(`/recipe-book/favorite`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              accountID: localStorage.getItem("userId"),
              id: recipe.id,
            },
          });
          const updatedFavorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
          ).concat(recipe);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setFavoriteRecipes(true);
        } catch (error) {
          console.error("Error adding recipe to favorites:", error);
          setFavError(true);
        }
      }
    })();
  };

  //When favError is true, wait 1.5 seconds before resetting
  useEffect(() => {
    if (favError) {
      const timer = setTimeout(() => {
        setFavError(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [favError]);

  return (
    // Background
    <div className="min-h-screen flex flex-col items-center bg-white overflow-auto w-full">
      {/* Nav */}
      <NavBar />

      {/* Outer Dash Box */}
      <div className="flex flex-col items-center justify-top flex-grow pt-10 w-[80%] print:w-full gap-3 font-['Inter'] mp-2 bg-[#F4EFE9]">
        {/* Recipe View Header Content */}
        <div className="flex flex-row items-center justify-between w-[90%]">
          {/* Back Button, Left Side Box */}
          <div className="flex items-center justify-start w-[25%]">
            <button
              className="text-2xl text-gray-700 hover:text-gray-900 items-center justify-center print:hidden"
              onClick={() => {
                navigate(-1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          </div>

          {/* Recipe Title, Center Box*/}
          <div className="text-4xl font-semibold text-center items-center justify-center w-[50%] print:w-full break-words">
            {(loading && "Loading Recipe...") ||
              (error ? "Oops! This recipe could not be found." : recipe?.name)}
          </div>

          {/* Right Side Buttons, Right Side Box */}
          <div className="flex flex-row gap-4 items-end justify-end w-[25%] ">
            {/* Manage Recipe */}
            {recipe?.accountID === localStorage.userId && (
              <div className="flex items-center justify-end w-[100px] print:hidden">
                <button
                  className="bg-[#746056] text-white rounded-lg p-2 w-[150px]"
                  onClick={() => {
                    navigate("/edit-recipe", { state: { recipe: recipe } });
                  }}
                >
                  Edit/Delete
                </button>
              </div>
            )}

            {/* Save Recipe and Print */}
            {!loading && !error && (
              <div className="flex flex-row items-center gap-4 justify-end print:hidden">
                {localStorage.getItem("userId") ? (
                  <button
                    className="bg-[#746056] text-white rounded-lg p-2"
                    style={{ width: "100px" }}
                    onClick={handleFavoriteToggle}
                  >
                    {favError
                      ? "Error"
                      : favoriteRecipes
                      ? "Unfavorite"
                      : "Favorite"}
                  </button>
                ) : (
                  <div style={{ width: "100px" }}></div>
                )}

                {/* Print Button */}
                <button
                  onClick={() => {
                    handlePrint();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Author */}
        <div className="text-black justify-center mb-10">{recipe?.author}</div>

        {/* Allergy Tags */}
        {recipe?.tags && recipe.tags.length > 0 && (
          <div className="flex flex-row gap-2 mb-10 items-center bg-white rounded-lg p-5 w-[90%] flex-wrap">
            {recipe?.tags.map((tag, index) => (
              <AllergyTag key={index} allergy={tag} />
            ))}
          </div>
        )}

        {/* Ingredients List */}
        <div className="flex flex-col gap-2 mb-10 items-star rounded-lg w-[90%]">
          <div className="text-xl font-semibold mb-2">Ingredients</div>
          <div className="bg-white p-3 text-gray-700 rounded-xl w-full gap-1">
            {recipe?.ingredients ? (
              recipe?.ingredients.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  <div className="break-words">{line}</div>
                </React.Fragment>
              ))
            ) : (
              <div>No ingredients listed.</div>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2 mb-10 items-star rounded-lg w-[90%]">
          <div className="text-xl font-semibold mb-2">Steps</div>
          <div className=" bg-white p-3 text-gray-700 rounded-xl w-full gap-1">
            {recipe?.instructions ? (
              recipe?.instructions.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  <div className="break-words">{line}</div>
                </React.Fragment>
              ))
            ) : (
              <div>No instructions listed.</div>
            )}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bottom-0 w-full print:hidden">
        <ContactBar />
      </div>
    </div>
  );
}

export default ViewRecipe;
