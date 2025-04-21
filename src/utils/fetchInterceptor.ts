import { API_URL } from "../data";

// fetchInterceptor.ts
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  let response = await originalFetch(...args);

  if (response.status === 401) {
    console.warn("Access token expired, attempting refresh...");

    // Call refresh API
    const refreshResponse = await originalFetch(`${API_URL}/refresh`, { 
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        },
      credentials: "include" 
    });

    if (refreshResponse.ok) {
      console.log("Token refreshed, retrying original request...");
      return originalFetch(...args); // Retry the original request
    } else {
      console.error("Session expired. User must log in again.");
    }
  }

  return response;
};
