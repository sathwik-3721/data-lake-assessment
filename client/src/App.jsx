import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LineageFlowView from "./components/LineageFlowView"; 
import Dashboard from "./components/Dashboard.jsx"

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lineage" element={<LineageFlowView />} />
      </Routes>
    
  );
}
