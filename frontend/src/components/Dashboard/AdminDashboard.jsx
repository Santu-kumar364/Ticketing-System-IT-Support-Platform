// components/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Container,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Switch,
  FormControlLabel,
  Snackbar,
  Slide,
} from "@mui/material";
import {
  Add,
  BugReport,
  ExitToApp,
  Person,
  Refresh,
  Comment as CommentIcon,
  Assignment,
  CheckCircle,
  Cancel,
  AccessTime,
  ChatBubbleOutline,
  Send,
  Delete,
  Dashboard,
  PriorityHigh,
  LowPriority,
  Whatshot,
  TrendingUp,
  Speed,
  AssignmentInd,
  Group,
  FilterList,
  AdminPanelSettings,
  People,
  BarChart,
  Settings,
  MoreVert,
  Edit,
  Visibility,
  Email,
  Phone,
  CalendarToday,
  Category,
  Security,
  Analytics,
  Report,
  Notifications,
  Download,
  Upload,
  Backup,
  Restore,
  Search,
  Close,
  AutoAwesome,
  TaskAlt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getAllTickets,
  updateTicketStatus,
  createComment,
  deleteTicket,
  assignTicket,
} from "../../redux/Ticket/ticket.action";
import {
  createUserAction,
  deleteUser,
  getAllUsers,
  logoutAction,
  updateUserRole,
} from "../../Redux/Auth/auth.action";

// Slide transition for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function AdminDashboard() {
  // State management
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketPage, setTicketPage] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [ticketRowsPerPage, setTicketRowsPerPage] = useState(10);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // New user state
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((store) => store.auth);
  const ticketState = useSelector((store) => store.ticket);

  // Extract data directly from state
  const user = auth.user || {};
  const users = auth.allUsers || [];
  const usersLoading = auth.usersLoading || false;
  const tickets = ticketState.tickets || [];
  const loading = ticketState.loading || false;
  const error = ticketState.error || null;

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    if (activeTab === 0) {
      dispatch(getAllTickets());
    } else if (activeTab === 1) {
      loadUsers();
    }
  };

  const loadUsers = async () => {
    try {
      await dispatch(getAllUsers());
    } catch (error) {
      console.error("Failed to load users:", error);
      showSnackbar("Failed to load users", "error");
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;

    try {
      await dispatch(createComment(selectedTicket.id, newComment));
      setNewComment("");
      setCommentDialogOpen(false);
      showSnackbar("Comment added successfully");
      loadData();
    } catch (error) {
      console.error("Failed to add comment:", error);
      showSnackbar("Failed to add comment", "error");
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await dispatch(updateTicketStatus(ticketId, newStatus));
      showSnackbar("Ticket status updated");
      loadData();
    } catch (error) {
      console.error("Failed to update status:", error);
      showSnackbar("Failed to update ticket status", "error");
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedAgent) return;

    try {
      await dispatch(assignTicket(selectedTicket.id, selectedAgent));
      setAssignDialogOpen(false);
      setSelectedAgent("");
      setAssignmentNote("");
      showSnackbar("Ticket assigned successfully");
      loadData();
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      showSnackbar("Failed to assign ticket", "error");
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;

    try {
      await dispatch(deleteTicket(selectedTicket.id));
      setDeleteDialogOpen(false);
      showSnackbar("Ticket deleted successfully");
      loadData();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      showSnackbar("Failed to delete ticket", "error");
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      setUpdatingUser(userId);
      await dispatch(updateUserRole(userId, newRole));
      showSnackbar("User role updated successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to update user role",
        "error"
      );
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(deleteUser(selectedUser.id));
      setUserDialogOpen(false);
      setSelectedUser(null);
      showSnackbar("User deleted successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleCreateUser = async () => {
    try {
      await dispatch(createUserAction(newUser));
      setCreateUserDialogOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
      });
      showSnackbar("User created successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to create user",
        "error"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "primary";
      case "IN_PROGRESS":
        return "warning";
      case "RESOLVED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "OPEN":
        return <Assignment color="primary" />;
      case "IN_PROGRESS":
        return <AccessTime color="warning" />;
      case "RESOLVED":
        return <CheckCircle color="success" />;
      case "CLOSED":
        return <Cancel color="default" />;
      default:
        return <Assignment />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "LOW":
        return <LowPriority color="success" />;
      case "MEDIUM":
        return <PriorityHigh color="warning" />;
      case "HIGH":
        return <Whatshot color="error" />;
      case "URGENT":
        return <Whatshot color="error" />;
      default:
        return <PriorityHigh />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "success";
      case "MEDIUM":
        return "warning";
      case "HIGH":
        return "error";
      case "URGENT":
        return "error";
      default:
        return "default";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "SUPPORT_AGENT":
        return "warning";
      case "USER":
        return "primary";
      default:
        return "default";
    }
  };

  // Safe ID display function
  const getDisplayId = (id) => {
    if (!id) return "N/A";
    const idStr = String(id);
    return `#${idStr.length > 6 ? idStr.slice(-6) : idStr}`;
  };

  // Calculate statistics
  const stats = {
    totalTickets: tickets?.length || 0,
    openTickets: tickets?.filter((t) => t.status === "OPEN").length || 0,
    inProgressTickets:
      tickets?.filter((t) => t.status === "IN_PROGRESS").length || 0,
    resolvedTickets:
      tickets?.filter((t) => t.status === "RESOLVED").length || 0,
    closedTickets: tickets?.filter((t) => t.status === "CLOSED").length || 0,
    highPriorityTickets:
      tickets?.filter((t) => t.priority === "HIGH" || t.priority === "URGENT")
        .length || 0,
    unassignedTickets: tickets?.filter((t) => !t.assignedAgent).length || 0,
    totalUsers: users?.length || 0,
    adminUsers: users?.filter((u) => u.role === "ADMIN").length || 0,
    supportAgents: users?.filter((u) => u.role === "SUPPORT_AGENT").length || 0,
    regularUsers: users?.filter((u) => u.role === "USER").length || 0,
  };

  // Filter tickets based on active filters
  const filteredTickets =
    tickets?.filter((ticket) => {
      const statusMatch =
        statusFilter === "ALL" || ticket.status === statusFilter;
      const priorityMatch =
        priorityFilter === "ALL" || ticket.priority === priorityFilter;
      const searchMatch =
        !searchTerm ||
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && priorityMatch && searchMatch;
    }) || [];

  // Filter users based on role filter and search
  const filteredUsers =
    users?.filter((user) => {
      const roleMatch =
        userRoleFilter === "ALL" || user.role === userRoleFilter;
      const searchMatch =
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return roleMatch && searchMatch;
    }) || [];

  // Get support agents for assignment
  const supportAgents =
    users?.filter((user) => user.role === "SUPPORT_AGENT") || [];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setUserRoleFilter("ALL");
    setSearchTerm("");
    setTicketPage(0);
    setUserPage(0);
  };

  // Paginated data
  const paginatedTickets = filteredTickets.slice(
    ticketPage * ticketRowsPerPage,
    ticketPage * ticketRowsPerPage + ticketRowsPerPage
  );

  const paginatedUsers = filteredUsers.slice(
    userPage * userRowsPerPage,
    userPage * userRowsPerPage + userRowsPerPage
  );

  if (auth?.loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
       
      <AppBar position="static" elevation={1} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <AutoAwesome sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" component="div" fontWeight="600">
              Raise My Issue
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip 
              icon={<Security />}
              label={`Administrator`} 
              color="secondary" 
              size="small"
            />
            
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: "white", color: "primary.main", fontSize: "14px", fontWeight: "bold" }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Statistics Overview */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Ticket Statistics */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="600"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <BarChart /> Ticket Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                      color: "white",
                    }}
                  >
                    <Typography variant="h4" fontWeight="700">
                      {stats.totalTickets}
                    </Typography>
                    <Typography variant="body2">Total Tickets</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "primary.main",
                      borderRadius: 1,
                      color: "white",
                    }}
                  >
                    <Typography variant="h4" fontWeight="700">
                      {stats.openTickets}
                    </Typography>
                    <Typography variant="body2">Open</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "warning.main",
                      borderRadius: 1,
                      color: "white",
                    }}
                  >
                    <Typography variant="h4" fontWeight="700">
                      {stats.inProgressTickets}
                    </Typography>
                    <Typography variant="body2">In Progress</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "success.main",
                      borderRadius: 1,
                      color: "white",
                    }}
                  >
                    <Typography variant="h4" fontWeight="700">
                      {stats.resolvedTickets}
                    </Typography>
                    <Typography variant="body2">Resolved</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* User Statistics */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="600"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <People /> User Statistics
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>Total Users</Typography>
                  <Chip label={stats.totalUsers} color="primary" size="small" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>Administrators</Typography>
                  <Chip label={stats.adminUsers} color="error" size="small" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>Support Agents</Typography>
                  <Chip
                    label={stats.supportAgents}
                    color="warning"
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>Regular Users</Typography>
                  <Chip label={stats.regularUsers} color="info" size="small" />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Header with Tabs */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h4" fontWeight="700" color="text.primary">
                  System Management
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={loadData}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>

              {/* Simplified Tabs - Only 2 tabs as per requirements */}
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab icon={<BugReport />} label="All Tickets" />
                <Tab icon={<People />} label="User Management" />
              </Tabs>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {typeof error === "string"
                  ? error
                  : error.message || "An error occurred"}
              </Alert>
            )}

            {/* Tickets Tab */}
            {activeTab === 0 && (
              <>
                {/* Filters */}
                <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="ALL">All Status</MenuItem>
                      <MenuItem value="OPEN">Open</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="RESOLVED">Resolved</MenuItem>
                      <MenuItem value="CLOSED">Closed</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <MenuItem value="ALL">All Priority</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="URGENT">Urgent</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ color: "text.secondary", mr: 1 }} />
                      ),
                      endAdornment: searchTerm && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm("")}
                        >
                          <Close />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress size={50} />
                  </Box>
                ) : !filteredTickets || filteredTickets.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <BugReport
                      sx={{
                        fontSize: 80,
                        color: "text.secondary",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      gutterBottom
                    >
                      No tickets found
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Assigned To</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedTickets.map((ticket) => (
                            <TableRow key={ticket.id} hover>
                              <TableCell>{getDisplayId(ticket.id)}</TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="500">
                                  {ticket.subject}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {ticket.createdBy?.firstName}{" "}
                                {ticket.createdBy?.lastName}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={getStatusIcon(ticket.status)}
                                  label={ticket.status.replace("_", " ")}
                                  color={getStatusColor(ticket.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={getPriorityIcon(ticket.priority)}
                                  label={ticket.priority}
                                  color={getPriorityColor(ticket.priority)}
                                  variant="outlined"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {ticket.assignedAgent ? (
                                  <Chip
                                    label={`${ticket.assignedAgent.firstName} ${ticket.assignedAgent.lastName}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                ) : (
                                  <Chip
                                    label="Unassigned"
                                    color="default"
                                    size="small"
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  ticket.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="View Details">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        navigate(`/tickets/${ticket.id}`)
                                      }
                                    >
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Assign Ticket">
                                    <IconButton
                                      size="small"
                                      color="secondary"
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setAssignDialogOpen(true);
                                      }}
                                    >
                                      <AssignmentInd />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Ticket">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredTickets.length}
                      rowsPerPage={ticketRowsPerPage}
                      page={ticketPage}
                      onPageChange={(e, newPage) => setTicketPage(newPage)}
                      onRowsPerPageChange={(e) => {
                        setTicketRowsPerPage(parseInt(e.target.value, 10));
                        setTicketPage(0);
                      }}
                    />
                  </>
                )}
              </>
            )}

            {/* User Management Tab */}
            {activeTab === 1 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={userRoleFilter}
                      label="Role"
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                    >
                      <MenuItem value="ALL">All Roles</MenuItem>
                      <MenuItem value="ADMIN">Administrators</MenuItem>
                      <MenuItem value="SUPPORT_AGENT">Support Agents</MenuItem>
                      <MenuItem value="USER">Users</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ color: "text.secondary", mr: 1 }} />
                      ),
                      endAdornment: searchTerm && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm("")}
                        >
                          <Close />
                        </IconButton>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateUserDialogOpen(true)}
                    sx={{ ml: "auto" }}
                  >
                    Add User
                  </Button>
                </Box>

                {usersLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress size={50} />
                  </Box>
                ) : !filteredUsers || filteredUsers.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <People
                      sx={{
                        fontSize: 80,
                        color: "text.secondary",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      gutterBottom
                    >
                      No users found
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedUsers.map((user) => (
                            <TableRow key={user.id} hover>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    {user.firstName?.[0]}
                                    {user.lastName?.[0]}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="500"
                                    >
                                      {user.firstName} {user.lastName}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <FormControl
                                  size="small"
                                  sx={{ minWidth: 120 }}
                                >
                                  <Select
                                    value={user.role}
                                    onChange={(e) =>
                                      handleUserRoleUpdate(
                                        user.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={updatingUser === user.id}
                                  >
                                    <MenuItem value="USER">User</MenuItem>
                                    <MenuItem value="SUPPORT_AGENT">
                                      Support Agent
                                    </MenuItem>
                                    <MenuItem value="ADMIN">
                                      Administrator
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                {updatingUser === user.id && (
                                  <CircularProgress size={16} sx={{ ml: 1 }} />
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={user.active ? "Active" : "Inactive"}
                                  color={user.active ? "success" : "default"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Send Email">
                                    <IconButton size="small" color="primary">
                                      <Email />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete User">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setUserDialogOpen(true);
                                      }}
                                      disabled={user.id === auth.user?.id} // Prevent self-deletion
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredUsers.length}
                      rowsPerPage={userRowsPerPage}
                      page={userPage}
                      onPageChange={(e, newPage) => setUserPage(newPage)}
                      onRowsPerPageChange={(e) => {
                        setUserRowsPerPage(parseInt(e.target.value, 10));
                        setUserPage(0);
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Dialogs */}
      {/* Add Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label="Your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Ticket Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Ticket</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Assign ticket to a support agent
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Support Agent</InputLabel>
            <Select
              value={selectedAgent}
              label="Support Agent"
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {supportAgents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.firstName} {agent.lastName} ({agent.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Assignment Note"
            value={assignmentNote}
            onChange={(e) => setAssignmentNote(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssignTicket}
            variant="contained"
            disabled={!selectedAgent}
          >
            Assign Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        open={createUserDialogOpen}
        onClose={() => setCreateUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                label="Role"
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="SUPPORT_AGENT">Support Agent</MenuItem>
                <MenuItem value="ADMIN">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={
              !newUser.firstName ||
              !newUser.lastName ||
              !newUser.email ||
              !newUser.password
            }
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteTicket}
            variant="contained"
            color="error"
          >
            Delete Ticket
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </Typography>
          {selectedUser && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="600">
                User Details:
              </Typography>
              <Typography variant="body2">
                {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
              <Typography variant="body2">{selectedUser.email}</Typography>
              <Typography variant="body2">Role: {selectedUser.role}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}