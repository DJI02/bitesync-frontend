import { useEffect, useState } from "react";

// This will search a list and then modify that list based on the search querry
// It requires three props:
// list: The list to be searched
// modifier: The property to search by
// setModifiedList: The function to call to set the modified list. It is important that this is a seperate state from the original list
function SearchBar({ list, modifier, setModifiedList }) {
  const [searchQuerry, setSearchQuerry] = useState(""); // State to hold the search querry, ie what the user is searching for

  useEffect(() => {
    setSearchQuerry("");
  }, [list]);

  return (
    <div className="flex flex-row rounded-lg p-1 min-w-[40%] w-full">
      {/* Search Input */}
      {!list || !modifier || !setModifiedList ? (
        // If any of the required props are missing, show the bar, but disable it, indicate not working
        <input
          type="text"
          placeholder="Error"
          className="h-9 border border-gray-300 border-r-0 rounded-l-lg focus:outline-none text-m w-full p-2"
        ></input>
      ) : (
        // If all required props are present, show the working search bar
        <input
          type="text"
          placeholder="Search..."
          value={searchQuerry}
          onChange={(e) => {
            setSearchQuerry(e.target.value);
            if (e.target.value === "") {
              setModifiedList(list);
              return;
            }
            const modifiedList = list.filter((item) =>
              (item[modifier] ?? "")
                .toString()
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
            );
            setModifiedList(modifiedList);
          }}
          maxLength={50}
          className="h-9 border border-gray-300 border-r-0 rounded-l-lg focus:outline-none text-m w-full p-2"
        ></input>
      )}
      {/* Search icon, no function, but good looking */}
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
  );
}

export default SearchBar;
