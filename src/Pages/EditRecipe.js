import { useEffect, useState } from "react";
import {
  NavBar,
  ContactBar,
  RecipeForm,
  Confirm,
  Modal,
  ErrorModal,
} from "../Components";
import { authenticatedFetch } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";

function EditRecipe() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const recipe = state?.recipe;

  // Modal States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // Error States
  const [errorMessage, setErrorMessage] = useState([]); // Error message state

  // Error handling
  const setError = (message, object) => {
    setErrorMessage([message, object]);
    setErrorOpen(true);
  };

  const closeErrorModal = () => {
    setErrorOpen(false);
    setErrorMessage([]);
  };

  useEffect(() => {
    if (errorMessage.length === 1) {
      const timer = setTimeout(() => {
        setErrorMessage([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!recipe) {
      console.error("No recipe data found in location state");
      navigate("/recipe-book"); // Redirect to recipe book if no recipe data
    }
  }, [recipe, navigate]);

  // API
  const handleEditRecipe = async (newRecipe) => {
    try {
      await authenticatedFetch(`/recipe-mgr/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          accountID: localStorage.getItem("userId"),
          id: recipe.id,
          author: recipe.author,
          name: newRecipe.name,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions,
          tags: newRecipe.tags,
        },
      });

      navigate("/recipe-book"); // Redirect to the recipe book page after creating the recipe
    } catch (error) {
      console.log("Something wrong with createRecipe:", error);
      setErrorMessage([error.message]);
    }
  };

  const handleDeleteRecipe = async () => {
    // Empty until API endpoints fixed
    try {
      await authenticatedFetch(`/recipe-mgr/delete`, {
        method: "DELETE",
        data: {
          accountID: localStorage.getItem("userId"),
          id: recipe.id,
        },
      });
      console.log("Recipe deleted successfully");
      navigate("/recipe-book"); // Redirect to the recipe book page after deleting the recipe
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setConfirmOpen(false);
      setError(error.message, "deleting recipe");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
        <NavBar />

        {/* background */}
        <div
          className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-4"
          style={{ backgroundColor: "#F4EFE9" }}
        >
          {/* inner form box */}
          <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter'] relative">
            <div className="flex flex-row items-center justify-between w-full mb-8">
              {/* Empty div so title is in center */}
              <div className="w-[75px]"></div>
              <h2 className="text-3xl font-bold text-center">Edit Recipe</h2>
              <button
                className="text-white w-[75px] py-2 rounded bg-[#746056]"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </button>
            </div>
            {/* Pass the old recipe data to the form */}
            <RecipeForm
              oldRecipe={recipe}
              onSubmit={handleEditRecipe}
              error={errorMessage.length === 1 ? errorMessage[0] : null}
            />
          </div>
        </div>

        <ContactBar />
      </div>

      {/* Modals */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Confirm
          message="Are you sure you want to delete this recipe?"
          onConfirm={handleDeleteRecipe}
          onCancel={() => setConfirmOpen(false)}
        />
      </Modal>
      <Modal isOpen={errorOpen} onClose={() => closeErrorModal()}>
        <ErrorModal
          message={errorMessage[0]}
          object={errorMessage[1]}
          onConfirm={() => closeErrorModal()}
        />
      </Modal>
    </>
  );
}

export default EditRecipe;
