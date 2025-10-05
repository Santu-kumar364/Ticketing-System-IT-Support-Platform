import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import SupportAgentDashboard from "./SupportAgentDashboard";
import { Box, CircularProgress, Alert, Button } from "@mui/material";

export default function DashboardRouter() {
  // Fix the state access - check the actual structure in Redux DevTools
  const authState = useSelector((store) => store.auth.auth || store.auth);
  const user = authState?.user;

  console.log("DashboardRouter: Full store:", useSelector((store) => store));
  console.log("DashboardRouter: Auth state:", authState);
  console.log("DashboardRouter: Current user:", user);

  // Loading state
  if (authState?.loading) {
    console.log("DashboardRouter: Showing loading state");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (authState?.error && !authState?.user) {
    console.log("DashboardRouter: Showing error state:", authState.error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load user data: {authState.error.message || authState.error}
        </Alert>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  // Route based on user role
  if (!user) {
    console.log("DashboardRouter: No user data available");
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          User data not available. Please log in again.
        </Alert>
        <Button 
          onClick={() => {
            localStorage.removeItem("jwt");
            window.location.href = "/login";
          }} 
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  console.log("DashboardRouter: Routing to dashboard for role:", user.role);
  
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'SUPPORT_AGENT':
      return <SupportAgentDashboard />;
    case 'USER':
    default:
      return <UserDashboard />;
  }
}