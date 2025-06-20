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
    const isSharedLink = location.search.includes("shared=true");

    // If not authenticated, not on login page, AND it's not a shared link, then redirect to login
    if (!authenticated && location.pathname !== "/login" && !isSharedLink) {
      navigate("/login");
    }
    // If authenticated and on login page, redirect to dashboard
    if (authenticated && location.pathname === "/login") {
      navigate("/dashboard");
    }
    // If it's a shared link and the path is /login (e.g. direct navigation to /login?shared=true), redirect to /dashboard?shared=true
    if (isSharedLink && location.pathname === "/login") {
      navigate(`/dashboard${location.search}`);
    }
    // If it's a shared link and not on /dashboard, redirect to /dashboard?shared=true (e.g. from /?shared=true or /lineage?shared=true)
    // This also handles the case where the initial route might be just "/" for the app.
    if (isSharedLink && location.pathname !== "/dashboard") {
       // Ensure we preserve other query params if any, though 'data' will be the main one.
      navigate(`/dashboard${location.search}`);
    }
    // If not authenticated, it is a shared link, but user is on root path, redirect to /dashboard?shared=true
    if (!authenticated && isSharedLink && location.pathname === "/") {
      navigate(`/dashboard${location.search}`);
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
