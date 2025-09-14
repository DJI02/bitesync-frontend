import api from "../api";

const handleUnauthorized = (response) => {
  if (response.status === 403) {
    // Clear stored credentials
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to login page
    window.location.href = "/";

    throw new Error("Your session has expired. Please log in again.");
  }
  return response;
};

// Check your authenticatedFetch implementation in api.js
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token"); // Make sure this key matches what you store in Login.js

  // Check if token exists and log it (for debugging)
  console.log(
    "Token from localStorage:",
    token ? "Token exists" : "No token found"
  );

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  console.log("Request headers:", headers); // Log headers for debugging

  try {
    const response = await api(url, {
      ...options,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    handleUnauthorized(error.response || {});
    throw error;
  }
};
