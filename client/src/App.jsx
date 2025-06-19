import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LineageFlowView from "./components/LineageFlowView";
import Dashboard from "./components/Dashboard.jsx";
import LoginForm from "./components/LoginForm";
import { useEffect, useState } from "react";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    setAuthenticated(isAuthenticated === "true");
  }, []);

useEffect(() =>{
  console.log(authenticated)
},[authenticated])

  // Protect dashboard routes
  useEffect(() => {
    if (!authenticated && location.pathname !== "/login") {
      navigate("/login");
    }
    if (authenticated && location.pathname === "/login") {
      navigate("/dashboard");
    }
  }, [authenticated, location.pathname, navigate]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="flex h-screen w-full items-center justify-center bg-[url('/login.jpeg')] bg-center bg-cover">
            <LoginForm setAuthenticated={setAuthenticated} />
          </div>
        }
      />
      <Route path="/dashboard" element={<Dashboard setAuthenticated={setAuthenticated}/>} />
      <Route path="/lineage" element={<LineageFlowView />} />
    </Routes>
  );
}
