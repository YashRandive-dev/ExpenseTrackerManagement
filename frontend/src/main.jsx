import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { BASE_URL } from "./utils/apiPaths";
import "./index.css";

// Wake the API (Render free tier sleeps) while the user is still typing their credentials.
fetch(`${BASE_URL}/api/health`, { mode: "cors", cache: "no-store" }).catch(() => {});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
