import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Apply saved theme before first paint to avoid flash
const saved = localStorage.getItem("gt-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (saved === "light" || (!saved && !prefersDark)) {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
