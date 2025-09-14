import { useState, useEffect } from "react";
import AttendeeModal from "../Modal/AtendeeModal";
import Modal from "../Modal";

function AttendeeCard({ attendee, recipes }) {
  const [modalOpen, setModalOpen] = useState(false); // State to control the AttendeeModal visibility
  const [recipeNames, setRecipeNames] = useState([]); // State to hold the names of the recipes
  const [recipeIDs, setRecipeIDs] = useState([]); // State to hold the IDs of the recipes

  // Splits the recipes into names and IDs for display
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      setRecipeNames(recipes.filter((_, idx) => idx % 2 === 1));
      setRecipeIDs(recipes.filter((_, idx) => idx % 2 === 0));
    }
  }, [recipes]);

  // ******************** TEMP DEBUGGING CODE ********************

  return (
    // General div allows for the button to be clicked to open the modal, but not change the cursor inside the modal
    <div className="w-full">
      {/* Button designed to allow for visual indication that the card is clickable */}
      <button
        className="w-full h-[175px] flex flex-col items-start justify-start p-4 bg-white rounded-lg shadow-md font-['Inter'] border-b-2 overflow-auto scrollbar-hide"
        onClick={() => setModalOpen(true)}
      >
        <>
          {!attendee?.id ? (
            <div className="text-xl font-semibold mb-2">Deleted User</div>
          ) : (
            <div className="text-xl font-semibold mb-2">
              {attendee?.username}
            </div>
          )}

          {/* Map through the user's allergies and display them */}
          <div className="flex flex-row flex-wrap gap-1 mb-4 items-center">
            {attendee?.tags && attendee.tags.length > 0 ? (
              <>
                <div className="text-sm text-gray-600">Allergies: </div>
                {attendee?.tags.map((allergy, index) => (
                  <div
                    key={index}
                    className="bg-[#A5907E] text-white px-2 py-1 rounded-full text-sm"
                    title={allergy}
                  >
                    {allergy}
                  </div>
                ))}
              </>
            ) : null}
          </div>

          {/* Maps through the user's recipes and displays them, regardless of if they are custom or not */}
          <div className="flex flex-row flex-wrap gap-1 items-center">
            {recipeNames.length > 0 ? (
              <>
                <div className="text-sm text-gray-600"> Recipies:</div>
                {recipeNames.map((recipe, index) => (
                  <div
                    key={index}
                    className="bg-[#A5907E] text-white px-2 py-1 rounded-full max-w-[30ch] overflow-hidden text-ellipsis text-sm whitespace-nowrap"
                  >
                    {recipe}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-sm text-gray-600">No recipes listed</div>
            )}
          </div>
        </>
      </button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <AttendeeModal
          attendeeInfo={attendee}
          recipeNames={recipeNames}
          recipeIDs={recipeIDs}
        />
      </Modal>
    </div>
  );
}

export default AttendeeCard;
