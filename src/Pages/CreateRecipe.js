import { useNavigate } from "react-router-dom";
import { NavBar, ContactBar, RecipeForm } from "../Components";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";

function CreateRecipe() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  // Add logic to handle login check here
  const handleCreateRecipe = async (recipe) => {
    //API CALL

    try {
      await authenticatedFetch("/recipe-mgr/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          accountID: localStorage.getItem("userId"),
          author: localStorage.getItem("userName"),
          name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          tags: recipe.tags,
        },
      });
      navigate("/recipe-book"); // Redirect to the recipe book page after creating the recipe
    } catch (err) {
      setError("Error creating recipe");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white overflow-hidden">
      <NavBar />

      {/* background */}
      <div
        className="flex flex-col items-center justify-top flex-grow p-4 w-[80%] gap-4"
        style={{ backgroundColor: "#F4EFE9" }}
      >
        {/* inner form box */}
        <div className="bg-white w-[90%] p-8 rounded-lg font-['Inter'] relative">
          <h2 className="text-3xl font-bold text-center mb-8">Create Recipe</h2>
          <RecipeForm onSubmit={handleCreateRecipe} />
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>

      <ContactBar />
    </div>
  );
}

export default CreateRecipe;
