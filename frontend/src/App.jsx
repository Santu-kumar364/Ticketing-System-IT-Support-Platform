import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import DashboardRouter from "./components/Dashboard/DashboardRouter";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import SupportAgentDashboard from "./components/Dashboard/SupportAgentDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";
import Loading from "./components/Common/Loading";
import { getProfileAction } from "./Redux/Auth/auth.action";
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  useEffect(() => {
    // Only attempt to get profile if we have a JWT but no user data
    if (jwt && !auth.user && !hasAttemptedAuth) {
      console.log("App: Attempting to fetch profile with existing JWT");
      setHasAttemptedAuth(true);
      dispatch(getProfileAction(jwt)).catch((error) => {
        console.error("Failed to get profile:", error);
        localStorage.removeItem("jwt");
      });
    }
  }, [dispatch, jwt, auth.user, hasAttemptedAuth]);

  // Show loading state while checking authentication
  if (jwt && !auth.user && !auth.error && auth.loading) {
    console.log("App: Showing loading state");
    return <Loading />;
  }

  // Helper function to redirect based on role
  const getDefaultRoute = (user) => {
    if (!user) return "/login";

    switch (user.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "SUPPORT_AGENT":
        return "/agent/dashboard";
      case "USER":
      default:
        return "/dashboard";
    }
  };

  console.log("App: Current auth state:", {
    hasJWT: !!jwt,
    hasUser: !!auth.user,
    loading: auth.loading,
    error: auth.error,
  });

  return (
    <Router>
      <Routes>
        {/* Authentication Routes - Only accessible when NOT logged in */}
        <Route
          path="/login"
          element={
            !auth.user ? (
              <Login />
            ) : (
              <Navigate to={getDefaultRoute(auth.user)} replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !auth.user ? (
              <Register />
            ) : (
              <Navigate to={getDefaultRoute(auth.user)} replace />
            )
          }
        />

        {/* Protected Routes - Role-based access */}
        <Route
          path="/dashboard"
          element={
            auth.user ? <DashboardRouter /> : <Navigate to="/login" replace />
          }
        />

        {/* Admin-specific routes */}
        <Route
          path="/admin/dashboard"
          element={
            auth.user && auth.user.role === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <Navigate to={getDefaultRoute(auth.user)} replace />
            )
          }
        />

        {/* Support Agent-specific routes */}
        <Route
          path="/agent/dashboard"
          element={
            auth.user && auth.user.role === "SUPPORT_AGENT" ? (
              <SupportAgentDashboard />
            ) : (
              <Navigate to={getDefaultRoute(auth.user)} replace />
            )
          }
        />

        {/* User-specific routes */}
        <Route
          path="/user/dashboard"
          element={
            auth.user && auth.user.role === "USER" ? (
              <UserDashboard />
            ) : (
              <Navigate to={getDefaultRoute(auth.user)} replace />
            )
          }
        />

        {/* Default redirects */}
        <Route
          path="/"
          element={
            <Navigate
              to={auth.user ? getDefaultRoute(auth.user) : "/login"}
              replace
            />
          }
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={
            <Navigate
              to={auth.user ? getDefaultRoute(auth.user) : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
