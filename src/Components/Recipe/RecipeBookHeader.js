import { useNavigate } from "react-router-dom";

function RecipeBookHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row relative items-center w-full gap-5 justify-between">
      {/* Search Bar */}
      <div className="flex flex-row rounded-lg pl-[5%] p-1 w-[40%]">
        <input
          type="text"
          placeholder="Search for recipes..."
          className="h-9 border border-gray-300 border-r-0 rounded-l-lg focus:outline-none text-m w-full p-2"
        ></input>

        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-9 border border-gray-300 border-l-0 p-1 rounded-r-lg bg-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      {/* Sort By Dropdown (Nonefunctional) */}
      <div className="text-center bg-[#746056] rounded-lg p-2 w-[150px] text-white mr-auto">
        <p>Sort By</p>
      </div>

      {/* Add Recipe Button */}
      <div className="bg-[#746056] text-white rounded-lg p-2 w-[150px] mr-[5%] text-center">
        <button onClick={() => navigate("/create-recipe")}>Add Recipe</button>
      </div>
    </div>
  );
}

export default RecipeBookHeader;
