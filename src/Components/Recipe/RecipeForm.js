import { useState } from "react";

function RecipeForm({ oldRecipe, onSubmit, error }) {
  //variables
  const authorID = oldRecipe?.authorID || localStorage.getItem("userId");
  const authorName = oldRecipe?.authorName || localStorage.getItem("userName");
  const [name, setName] = useState(oldRecipe?.name || "");
  const [tags, setTags] = useState(oldRecipe?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [ingredients, setIngredients] = useState(oldRecipe?.ingredients || "");
  const [instructions, setInstructions] = useState(
    oldRecipe?.instructions || ""
  );

  const recipe = {
    authorID,
    authorName,
    name,
    tags,
    ingredients,
    instructions,
  };

  return (
    <div className="space-y-6">
      {/* recipe name */}
      <div>
        <label className="block font-medium mb-1">Recipe Name</label>
        <input
          type="text"
          placeholder="Recipe Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={127}
          className="w-full border p-2 rounded-lg"
          required
        />
      </div>

      {/* allergy tags */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Allergy Tags</label>
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-[#7A5E48] text-white px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((_, i) => i !== index))}
                className="ml-1 text-white hover:text-red-300 transition"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            maxLength={31}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const trimmed = newTag.trim();
                if (trimmed.length > 0 && !tags.includes(trimmed)) {
                  setTags([...tags, trimmed]);
                }
                setNewTag("");
              }
            }}
            className="border rounded-lg px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = newTag.trim();
              if (trimmed && !tags.includes(trimmed)) {
                setTags([...tags, trimmed]);
              }
              setNewTag("");
            }}
            className="bg-[#7A5E48] text-white px-3 py-1 rounded-full text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* ingredients box */}
      <div>
        <label className="block font-medium mb-1">Ingredients</label>
        <textarea
          placeholder="List ingredients (one per line)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full border p-2 rounded-lg"
          maxLength={1023}
          rows={4}
          required
        />
      </div>

      {/* steps box */}
      <div>
        <label className="block font-medium mb-1">Steps</label>
        <textarea
          placeholder="List steps (one per line)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full border p-2 rounded-lg"
          rows={4}
          maxLength={1023}
          required
        />
      </div>

      {/* button submit */}
      {error && <p className="text-red-500 text-bold text-lg">{error}</p>}
      <button
        type="submit"
        onClick={() => {
          onSubmit(recipe);
        }}
        className="w-full bg-[#7A5E48] text-white py-2 rounded-lg hover:bg-[#604836] transition"
      >
        Confirm
      </button>
    </div>
  );
}

export default RecipeForm;
