import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18next.js";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Suspense fallback={<div>Loading...</div>}>
      <App />
  </Suspense>
);

reportWebVitals();
