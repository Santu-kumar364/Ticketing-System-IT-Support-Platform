import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Box,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  SupportAgent,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { loginUserAction } from "../Redux/Auth/auth.action";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store.auth);

  useEffect(() => {
    console.log("Auth state changed:", auth);

    if (auth?.user && auth.isAuthenticated) {
      redirectBasedOnRole(auth.user);
    }
  }, [auth, navigate]);

  const redirectBasedOnRole = (user) => {
    console.log("Redirecting user with role:", user.role);

    switch (user.role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "SUPPORT_AGENT":
        navigate("/agent/dashboard");
        break;
      case "USER":
      default:
        navigate("/dashboard");
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(loginUserAction({ email, password }));
      console.log("Login dispatch completed");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isPossibleAdminEmail = email.includes("admin");
  const isPossibleSupportEmail =
    email.includes("support") || email.includes("agent");

  const getRoleHint = () => {
    if (isPossibleAdminEmail) return "Admin Login Detected";
    if (isPossibleSupportEmail) return "Support Agent Login Detected";
    return null;
  };

  const roleHint = getRoleHint();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 375 }}>
        {/* Main Login Card */}
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            border: "1px solid #dbdbdb",
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 300,
                fontFamily: "'Instagram Sans', sans-serif",
                color: "#262626",
                fontSize: "2.5rem",
                mb: 2,
              }}
            >
              Ticketing System
            </Typography>

            {roleHint && (
              <Fade in={!!roleHint}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    padding: "4px 8px",
                    border: "1px solid #dbdbdb",
                    borderRadius: "4px",
                    backgroundColor: "#fafafa",
                    fontSize: "0.75rem",
                    color: "#262626",
                    mb: 2,
                  }}
                >
                  {isPossibleAdminEmail ? (
                    <AdminPanelSettings sx={{ fontSize: 16 }} />
                  ) : (
                    <SupportAgent sx={{ fontSize: 16 }} />
                  )}
                  {roleHint}
                </Box>
              </Fade>
            )}
          </Box>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Email address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "3px",
                  backgroundColor: "#fafafa",
                  fontSize: "0.8rem",
                  "& fieldset": {
                    borderColor: "#dbdbdb",
                  },
                  "&:hover fieldset": {
                    borderColor: "#a8a8a8",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a8a8a8",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "12px 8px",
                  fontSize: "0.8rem",
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ padding: "4px" }}
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ fontSize: 18, color: "#8e8e8e" }}
                        />
                      ) : (
                        <Visibility sx={{ fontSize: 18, color: "#8e8e8e" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "3px",
                  backgroundColor: "#fafafa",
                  fontSize: "0.8rem",
                  "& fieldset": {
                    borderColor: "#dbdbdb",
                  },
                  "&:hover fieldset": {
                    borderColor: "#a8a8a8",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a8a8a8",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "12px 8px",
                  fontSize: "0.8rem",
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !email || !password}
              sx={{
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: loading ? "#b2dffc" : "#0095f6",
                color: "white",
                "&:hover": {
                  backgroundColor: loading ? "#b2dffc" : "#1877f2",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#b2dffc",
                  color: "white",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Log in"
              )}
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2.5,
            border: "1px solid #dbdbdb",
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#262626", fontSize: "0.9rem" }}
          >
            Don't have an account?{" "}
            <Button
              component={Link}
              to="/register"
              variant="text"
              sx={{
                textTransform: "none",
                color: "#0095f6",
                fontWeight: 600,
                fontSize: "0.9rem",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#1877f2",
                },
              }}
            >
              Sign up
            </Button>
          </Typography>
        </Paper>

        {/* Admin Note */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{ color: "#8e8e8e", fontSize: "0.75rem" }}
          >
            Need admin/support access? Contact system administrator
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
