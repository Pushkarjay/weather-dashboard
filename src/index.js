import React from "react";
import { createRoot } from "react-dom/client"; // Updated import
import App from "./App";
import "./index.css";

console.log("Rendering App");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found. Ensure 'index.html' has a div with id 'root'.");
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
}