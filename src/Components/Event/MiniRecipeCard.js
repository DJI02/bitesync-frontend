import React, { useEffect, useState } from "react";

function MiniRecipeCard({ recipe, setRegisteredRecipes, recipesToRegister }) {
  const [seeMore, setSeeMore] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(recipesToRegister.includes(recipe.id));
  }, [recipesToRegister, recipe.id]);

  return (
    <div className="flex flex-col justify-start w-full p-2 border-b border-gray-200">
      {/* Recipe Card, div for consistant height of all cards */}
      <div
        key={recipe?.id}
        className="flex flex-row justify-between w-full h-[55px]"
      >
        {/* Basic Recipe Info */}
        <div className="flex flex-col w-[75%]">
          <span>
            {recipe?.name} by {recipe.author}
          </span>
          <div className="text-sm text-gray-600 flex flex-row gap-1 justify-start items-start overflow-auto w-full">
            {/* Recipe Tags */}
            {recipe?.tags?.map((tag, index) => (
              <div
                key={index}
                className="bg-[#ede6dd] rounded-full px-2 py-1 text-black whitespace-nowrap"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {/* Button to open up ingredients list */}
          <button
            className="bg-[#A5907E] text-white rounded-lg px-4 py-2 w-[100px]"
            onClick={() => setSeeMore(!seeMore)}
          >
            {seeMore ? "See Less" : "See More"}
          </button>

          {/* Button to add recipe to registration */}
          <button
            className="bg-[#A5907E] text-white rounded-lg px-4 py-2 w-[90px]"
            onClick={() => {
              if (!selected) {
                setRegisteredRecipes([
                  ...recipesToRegister,
                  recipe.id,
                  recipe.name,
                ]);
                setSelected(true);
              } else {
                setRegisteredRecipes(
                  recipesToRegister.filter(
                    (item, idx, arr) =>
                      !(item === recipe.id && arr[idx + 1] === recipe.name) &&
                      !(arr[idx - 1] === recipe.id && item === recipe.name)
                  )
                );
                setSelected(false);
              }
            }}
          >
            {selected ? "Deselect" : "Select"}
          </button>
        </div>
      </div>

      {/* Openable ingredients list */}
      {seeMore && (
        <div className="mt-2 text-gray-700 items-start justify-start">
          <p>
            Ingredients:{" "}
            {recipe?.ingredients.split("\n").map((ingredient, index) => (
              <React.Fragment key={index}>
                {ingredient}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

export default MiniRecipeCard;
