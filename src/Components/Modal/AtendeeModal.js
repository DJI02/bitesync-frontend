import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AttendeeModal({ attendeeInfo, recipeNames, recipeIDs }) {
  const navigator = useNavigate();
  const [custom, setCustom] = useState([]); // State to hold onto custom recipes
  const [preselected, setPreselected] = useState([]); // State to hold onto preselected recipes
  const [selectedIDs, setSelectedIDs] = useState([]); // State to hold onto selected recipe IDs

  //   Sorts the recipeNames into custom and preselected recipes
  useEffect(() => {
    if (recipeNames && recipeIDs) {
      const customRecipes = recipeNames.filter(
        (name, index) => recipeIDs[index] === "~"
      );
      const preselectedRecipes = recipeNames.filter(
        (name, index) => recipeIDs[index] !== "~"
      );
      const selectedRecipeIDs = recipeIDs.filter((id) => id !== "~");
      setCustom(customRecipes);
      setPreselected(preselectedRecipes);
      setSelectedIDs(selectedRecipeIDs);
    }
  }, [recipeNames, recipeIDs]);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full font-['Inter']">
      {/* Title Box: Attendee Name */}
      <div
        className="h-[60px] w-[90%] p-4 rounded-lg shadow-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        {attendeeInfo?.username}
      </div>

      {/* Allergies Section */}
      <div className="w-[90%] mb-4">
        <h2 className="text-xl font-semibold mb-2 text-start">Allergies</h2>
        <div className="flex flex-wrap gap-2">
          {attendeeInfo?.tags && attendeeInfo.tags.length > 0 ? (
            attendeeInfo.tags.map((allergy, index) => (
              <span
                key={index}
                className="bg-[#A5907E] rounded-full px-2 py-1 text-white test-sm"
              >
                {allergy}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-600">No Allergies</span>
          )}
        </div>
      </div>

      {/* Recipes Section */}
      <div className="justify-start w-[90%]">
        <h2 className="text-xl font-semibold mb-2 text-start">Recipes</h2>
        {/* If there are custom recipes, display them */}
        <div className="flex flex-col gap-2">
          {custom.length > 0 && (
            <>
              <h3 className="text-md mb-1 text-start"> Custom Entries: </h3>
              {custom.map((recipe, index) => (
                <span
                  key={recipe}
                  className="bg-[#F4EFE9] px-2 py-2 rounded-full text-md w-full overflow-auto"
                >
                  {recipe}
                </span>
              ))}
            </>
          )}
          {/* If there are preselected recipes, display them */}
          {preselected.length > 0 && (
            <>
              <h3 className="text-md mb-1 text-start"> Registered Recipes: </h3>
              {preselected.map((recipe, index) => (
                <span
                  key={recipe}
                  className="bg-[#F4EFE9] px-2 py-2 rounded-full text-md w-full"
                >
                  <div className="flex flex-row justify-between items-center">
                    <span className="overflow-auto whitespace-nowrap w-[calc(100%-120px)]">
                      {recipe}
                    </span>
                    <button
                      className="w-[100px] text-center bg-[#A5907E] text-white px-2 py-1 rounded-full"
                      onClick={() => {
                        navigator(`/recipe/${selectedIDs[index]}`);
                      }}
                    >
                      View Recipe
                    </button>
                  </div>
                </span>
              ))}
            </>
          )}
          {/* If there are no recipes, display a message */}
          {custom.length === 0 && preselected.length === 0 && (
            <span className="text-sm text-gray-600">No Recipes</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendeeModal;
