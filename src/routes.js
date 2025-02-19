import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Repository from "./pages/Repository";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/repository/:repository" element={<Repository />} />
      </Routes>
    </BrowserRouter>
  );
}
