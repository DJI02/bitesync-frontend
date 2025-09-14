// Components/Dropdown.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import BiteSyncLogo from "../Pictures/BiteSyncLogo.webp";

function Dropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative text-left" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <img src={BiteSyncLogo} alt="BiteSync Logo" className="w-24 h-24" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border rounded shadow-lg z-10">
          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
            Profile
          </Link>
          <button
            className="w-full px-4 py-2 hover:bg-gray-100 text-start"
            onClick={() => {
              // Remove all authentication-related items from localStorage
              localStorage.removeItem("userId");
              localStorage.removeItem("userName");
              localStorage.removeItem("token"); // Remove the JWT token
              localStorage.removeItem("favorites"); // Remove favorites

              // Navigate to the login page
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
