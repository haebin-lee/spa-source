import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ApiTest from "./components/ApiTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api-test" element={<ApiTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
