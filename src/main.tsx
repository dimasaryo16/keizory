// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App";
import NoThanks from "./no_thanks";
import Validate from "./validate"; // ✅ import validate.tsx
import Dashboard from "./dashboard";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/no_thanks" element={<NoThanks />} />
        <Route path="/validate" element={<Validate />} /> {/* ✅ tambahin route validate */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
