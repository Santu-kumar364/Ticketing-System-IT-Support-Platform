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
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  SupportAgent,
  Person,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { registerUserAction } from "../Redux/Auth/auth.action";

export default function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("USER");
  const [adminCode, setAdminCode] = useState("");
  const [supportAgentCode, setSupportAgentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store.auth);

  useEffect(() => {
    if (auth?.user) {
      if (auth.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (auth.user.role === "SUPPORT_AGENT") {
        navigate("/agent/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (role === "ADMIN" && adminCode !== "ADMIN2024") {
      setError("Invalid admin registration code");
      setLoading(false);
      return;
    }

    if (role === "SUPPORT_AGENT" && supportAgentCode !== "AGENT2024") {
      setError("Invalid support agent registration code");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        role: role,
      };

      await dispatch(registerUserAction(userData));
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (roleType) => {
    switch (roleType) {
      case "ADMIN":
        return "Full system access - manage users, tickets, and system settings";
      case "SUPPORT_AGENT":
        return "Handle and resolve customer tickets - assigned by admins";
      default:
        return "Create and manage your own support tickets";
    }
  };

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
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {/* Main Register Card */}
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
              Raise My Issue
            </Typography>
            
          </Box>

          {/* Error Messages */}
          {error && (
            <Fade in={!!error}>
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  fontSize: "0.8rem",
                  backgroundColor: "#fee",
                  color: "#ed4956",
                  border: "1px solid #ed4956",
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {auth?.error && (
            <Fade in={!!auth?.error}>
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  fontSize: "0.8rem",
                  backgroundColor: "#fee",
                  color: "#ed4956",
                  border: "1px solid #ed4956",
                }}
              >
                {auth.error.message || "Registration failed"}
              </Alert>
            </Fade>
          )}

          {/* Register Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                placeholder="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
            </Box>

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
                      {showPassword ? 
                        <VisibilityOff sx={{ fontSize: 18, color: "#8e8e8e" }} /> : 
                        <Visibility sx={{ fontSize: 18, color: "#8e8e8e" }} />
                      }
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

            {/* Role Selection */}
            <Box sx={{ mt: 1 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    mb: 1, 
                    fontSize: "0.8rem",
                    color: "#262626",
                    textAlign: "left"
                  }}
                >
                  Account Type
                </FormLabel>
                <RadioGroup
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {/* USER Role */}
                    <Paper
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: role === "USER" ? "#0095f6" : "#dbdbdb",
                        backgroundColor: role === "USER" ? "#f0f8ff" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setRole("USER")}
                    >
                      <FormControlLabel
                        value="USER"
                        control={
                          <Radio 
                            size="small" 
                            sx={{ 
                              color: role === "USER" ? "#0095f6" : "#dbdbdb",
                              '&.Mui-checked': {
                                color: "#0095f6",
                              },
                            }} 
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Person sx={{ fontSize: 18, color: "#0095f6" }} />
                            <Box sx={{ textAlign: "left" }}>
                              <Typography variant="body2" fontWeight="500">
                                Regular User
                              </Typography>
                              <Typography variant="caption" color="#8e8e8e">
                                Create and track your tickets
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ margin: 0, width: "100%" }}
                      />
                    </Paper>

                    {/* SUPPORT_AGENT Role */}
                    <Paper
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: role === "SUPPORT_AGENT" ? "#ffa726" : "#dbdbdb",
                        backgroundColor: role === "SUPPORT_AGENT" ? "#fff3e0" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setRole("SUPPORT_AGENT")}
                    >
                      <FormControlLabel
                        value="SUPPORT_AGENT"
                        control={
                          <Radio 
                            size="small" 
                            sx={{ 
                              color: role === "SUPPORT_AGENT" ? "#ffa726" : "#dbdbdb",
                              '&.Mui-checked': {
                                color: "#ffa726",
                              },
                            }} 
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <SupportAgent sx={{ fontSize: 18, color: "#ffa726" }} />
                            <Box sx={{ textAlign: "left" }}>
                              <Typography variant="body2" fontWeight="500">
                                Support Agent
                              </Typography>
                              <Typography variant="caption" color="#8e8e8e">
                                Help resolve user tickets
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ margin: 0, width: "100%" }}
                      />
                    </Paper>

                    {/* ADMIN Role */}
                    <Paper
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: role === "ADMIN" ? "#ed4956" : "#dbdbdb",
                        backgroundColor: role === "ADMIN" ? "#ffebee" : "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setRole("ADMIN")}
                    >
                      <FormControlLabel
                        value="ADMIN"
                        control={
                          <Radio 
                            size="small" 
                            sx={{ 
                              color: role === "ADMIN" ? "#ed4956" : "#dbdbdb",
                              '&.Mui-checked': {
                                color: "#ed4956",
                              },
                            }} 
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AdminPanelSettings sx={{ fontSize: 18, color: "#ed4956" }} />
                            <Box sx={{ textAlign: "left" }}>
                              <Typography variant="body2" fontWeight="500">
                                Administrator
                              </Typography>
                              <Typography variant="caption" color="#8e8e8e">
                                Full system access
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ margin: 0, width: "100%" }}
                      />
                    </Paper>
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Admin Code Input */}
            {role === "ADMIN" && (
              <Fade in={role === "ADMIN"}>
                <Box>
                  <TextField
                    fullWidth
                    placeholder="Admin registration code"
                    variant="outlined"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "3px",
                        backgroundColor: "#fafafa",
                        fontSize: "0.8rem",
                        "& fieldset": {
                          borderColor: "#dbdbdb",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "12px 8px",
                        fontSize: "0.8rem",
                      },
                    }}
                  />
          
                </Box>
              </Fade>
            )}

            {/* Support Agent Code Input */}
            {role === "SUPPORT_AGENT" && (
              <Fade in={role === "SUPPORT_AGENT"}>
                <Box>
                  <TextField
                    fullWidth
                    placeholder="Support agent registration code"
                    variant="outlined"
                    type="password"
                    value={supportAgentCode}
                    onChange={(e) => setSupportAgentCode(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "3px",
                        backgroundColor: "#fafafa",
                        fontSize: "0.8rem",
                        "& fieldset": {
                          borderColor: "#dbdbdb",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "12px 8px",
                        fontSize: "0.8rem",
                      },
                    }}
                  />
                   
                </Box>
              </Fade>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={
                loading ||
                !email ||
                !firstName ||
                !lastName ||
                !password ||
                (role === "ADMIN" && !adminCode) ||
                (role === "SUPPORT_AGENT" && !supportAgentCode)
              }
              sx={{
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: loading ? "#b2dffc" : "#0095f6",
                color: "white",
                mt: 1,
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
                `Sign up as ${role === "ADMIN" ? "Admin" : role === "SUPPORT_AGENT" ? "Support Agent" : "User"}`
              )}
            </Button>
          </Box>
        </Paper>

        {/* Login Redirect Section */}
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
          <Typography variant="body2" sx={{ color: "#262626", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Button
              component={Link}
              to="/login"
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
              Log in
            </Button>
          </Typography>
        </Paper>

        {/* Admin Note */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{ color: "#8e8e8e", fontSize: "0.75rem" }}
          >
            Admin and Support Agent roles require special access codes
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}