import React from "react";
import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.id}`} // Link to the recipe details page
      className="flex flex-row outline outline-1 p-2 font-['Inter'] bg-white rounded-lg w-full h-[150px]"
    >
      {/* Basic info and allergy */}
      <div className="flex flex-col justify-between w-[60%] p-2">
        <div>
          <div className="text-2xl text-start font-semibold line-clamp-1">
            {recipe.name}
          </div>
          <div className="text-md text-start text-gray-600 line-clamp-1">
            {recipe.author}
          </div>
        </div>
        <div className="py-2 flex flex-row gap-1 overflow-auto">
          {recipe?.tags?.length > 0 ? (
            recipe?.tags?.map((tag) => (
              <div
                className="bg-[#A5907E] rounded-full px-2 py-1 text-white"
                key={tag}
              >
                {tag}
              </div>
            ))
          ) : (
            <div className="text-sm text-start text-gray-600">No Allergies</div>
          )}
        </div>
      </div>

      {/* Brief Ingredients List */}
      <div className="w-[40%] text-start">
        <p className="text-lg">Ingredients:</p>

        {recipe?.ingredients?.trim() ? (
          <div className="relative overflow-hidden whitespace-pre-line line-clamp-5 text-sm">
            {recipe.ingredients.replace(/\n\n+/g, "\n").trim()}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No Ingredients</div>
        )}
      </div>
    </Link>
  );
}

export default RecipeCard;
