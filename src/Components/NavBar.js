import { Link } from "react-router-dom";
import AccountDrop from "./AccountDrop";

function NavBar() {
  const links = [
    { to: "/recipe-book", label: "Recipe Book" },
    { to: "/create-recipe", label: "Create Recipe" },
    { to: "/favorite-recipes", label: "Favorite Recipes" },
    { to: "/manage-events", label: "Manage Events" },
    { to: "/create-events", label: "Create Events" },
  ];

  return (
    <div
      className="relative w-full h-24 left-0 top-0 print:hidden flex flex-row overflow-show"
      style={{ backgroundColor: "#A5907E" }}
    >
      <Link
        to="/dash"
        className="w-72 h-24 rounded-tr-lg rounded-br-lg inline-flex justify-center items-center"
      >
        <div className="text-center justify-center text-white text-6xl font-normal font-['Roboto'] leading-[64px]">
          BiteSync
        </div>
      </Link>

      <div className="flex flex-row items-center justify-end flex-grow">
        <div className="flex flex-row gap-1 pr-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="w-40 h-24 p-3 rounded-lg inline-flex justify-center items-center overflow-hidden"
            >
              <div className="justify-start text-white font-['Inter'] leading-none">
                {link.label}
              </div>
            </Link>
          ))}
        </div>
        <div className="pr-4">
          <AccountDrop />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
