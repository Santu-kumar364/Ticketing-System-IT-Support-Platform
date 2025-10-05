// components/Dashboard/UserDashboard.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Tooltip,
  Snackbar,
  InputAdornment,
  LinearProgress,
  useTheme,
  useMediaQuery,
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
  Search,
  Download,
  AutoAwesome,
  TaskAlt,
  Warning,
  Settings,
  Help,
  CalendarToday,
  AssignmentInd,
  Security,
  Person2,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import {
  getUserTickets,
  updateTicketStatus,
  createComment,
  deleteTicket,
  clearTicketErrors,
} from "../../Redux/Ticket/ticket.action";
import CreateTicket from "./CreateTicket";
import { logoutAction } from "../../Redux/Auth/auth.action";

// Ticket Card Component for better organization
const TicketCard = React.memo(
  ({ ticket, user, onStatusUpdate, onAddComment, updating }) => {
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
          return <Warning color="error" />;
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

    const canCloseTicket = ticket.status === "RESOLVED";

    return (
      <Card
        elevation={1}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography
                variant="h6"
                component="h2"
                fontWeight="600"
                sx={{ mb: 1 }}
              >
                {ticket.subject}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 1,
                }}
              >
                {ticket.description}
              </Typography>

              {/* Ticket Meta Information */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  icon={<CalendarToday sx={{ fontSize: 14 }} />}
                  label={new Date(ticket.createdAt).toLocaleDateString()}
                  size="small"
                  variant="outlined"
                />
                {ticket.assignedAgent && (
                  <Chip
                    icon={<AssignmentInd sx={{ fontSize: 14 }} />}
                    label={`Assigned to: ${ticket.assignedAgent.firstName} ${ticket.assignedAgent.lastName}`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                )}
                {!ticket.assignedAgent && (
                  <Chip
                    label="Awaiting Assignment"
                    color="default"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Status & Priority Badges */}
            <Stack spacing={0.5} sx={{ minWidth: 140, alignItems: "flex-end" }}>
              <Chip
                icon={getStatusIcon(ticket.status)}
                label={ticket.status.replace("_", " ")}
                color={getStatusColor(ticket.status)}
                size="small"
              />
              <Chip
                icon={getPriorityIcon(ticket.priority)}
                label={ticket.priority}
                color={getPriorityColor(ticket.priority)}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>

          {/* Comments Preview */}
          {ticket.comments && ticket.comments.length > 0 && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="600">
                Recent Activity
              </Typography>
              <List dense>
                {ticket.comments.slice(-2).map((comment, index) => (
                  <ListItem
                    key={index}
                    alignItems="flex-start"
                    sx={{ px: 0, py: 0.5 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: "0.7rem",
                          bgcolor: "primary.main",
                        }}
                      >
                        {comment.user?.firstName?.[0]}
                        {comment.user?.lastName?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {comment.user?.firstName} {comment.user?.lastName} •{" "}
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mt: 2,
            }}
          >
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {/* Add Comment */}
              <Tooltip title="Add comment to ticket">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ChatBubbleOutline />}
                  onClick={() => onAddComment(ticket)}
                  sx={{ borderRadius: 1 }}
                >
                  Comment
                </Button>
              </Tooltip>

              {/* Close Ticket - Only for resolved tickets */}
              {canCloseTicket && (
                <Tooltip title="Close this resolved ticket">
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => onStatusUpdate(ticket.id, "CLOSED")}
                    disabled={updating}
                    startIcon={<CheckCircle />}
                    sx={{ borderRadius: 1 }}
                  >
                    Close Ticket
                  </Button>
                </Tooltip>
              )}
            </Stack>

            <Stack spacing={0.5} alignItems="flex-end">
              <Typography variant="caption" color="text.secondary">
                Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
              </Typography>
              {ticket.comments && ticket.comments.length > 0 && (
                <Badge
                  badgeContent={ticket.comments.length}
                  color="primary"
                  size="small"
                >
                  <CommentIcon color="action" fontSize="small" />
                </Badge>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

export default function UserDashboard() {
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const auth = useSelector((store) => store.auth);
  const { tickets, loading, error, updating } = useSelector(
    (store) => store.ticket
  );

  const user = auth.user || {};

  // Load data on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadTickets();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearTicketErrors());
    };
  }, [dispatch]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadTickets = useCallback(async () => {
    try {
      await dispatch(getUserTickets());
    } catch (error) {
      console.error("Failed to load tickets:", error);
      showSnackbar("Failed to load tickets", "error");
    }
  }, [dispatch]);

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
      loadTickets();
    } catch (error) {
      console.error("Failed to add comment:", error);
      showSnackbar("Failed to add comment", "error");
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    // Users can only close resolved tickets
    if (newStatus !== "CLOSED") {
      showSnackbar("You can only close resolved tickets", "error");
      return;
    }

    try {
      await dispatch(updateTicketStatus(ticketId, newStatus));
      showSnackbar(`Ticket closed successfully`);
      loadTickets();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      showSnackbar(errorMessage, "error");
    }
  };

  // Memoized calculations for better performance
  const { filteredTickets, stats } = useMemo(() => {
    const filteredTickets = (tickets || []).filter((ticket) => {
      const statusMatch =
        statusFilter === "ALL" || ticket.status === statusFilter;
      const priorityMatch =
        priorityFilter === "ALL" || ticket.priority === priorityFilter;
      const searchMatch =
        !searchTerm ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && priorityMatch && searchMatch;
    });

    const stats = {
      open: tickets?.filter((t) => t.status === "OPEN").length || 0,
      inProgress:
        tickets?.filter((t) => t.status === "IN_PROGRESS").length || 0,
      resolved: tickets?.filter((t) => t.status === "RESOLVED").length || 0,
      closed: tickets?.filter((t) => t.status === "CLOSED").length || 0,
      total: tickets?.length || 0,
    };

    return { filteredTickets, stats };
  }, [tickets, statusFilter, priorityFilter, searchTerm]);

  const exportTickets = () => {
    const csvData = filteredTickets.map((ticket) => ({
      ID: ticket.id,
      Subject: ticket.subject,
      Status: ticket.status,
      Priority: ticket.priority,
      "Assigned To": ticket.assignedAgent
        ? `${ticket.assignedAgent.firstName} ${ticket.assignedAgent.lastName}`
        : "Unassigned",
      "Created Date": new Date(ticket.createdAt).toLocaleDateString(),
      "Last Updated": new Date(ticket.updatedAt).toLocaleDateString(),
    }));

    // Simple CSV export implementation
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-tickets-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showSnackbar("Tickets exported successfully");
  };

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
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <AutoAwesome sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" component="div" fontWeight="600">
              Ticketing System
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`User`}
              color="secondary"
              variant="filled"
              icon={<Person />}
            />

            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "white",
                  color: "error.main",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <Typography variant="h4" fontWeight="700">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2">Total Tickets</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "info.main",
                    color: "white",
                  }}
                >
                  <Typography variant="h4" fontWeight="700">
                    {stats.open}
                  </Typography>
                  <Typography variant="body2">Open</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "warning.main",
                    color: "white",
                  }}
                >
                  <Typography variant="h4" fontWeight="700">
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "success.main",
                    color: "white",
                  }}
                >
                  <Typography variant="h4" fontWeight="700">
                    {stats.resolved}
                  </Typography>
                  <Typography variant="body2">Resolved</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your support tickets efficiently
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateTicketOpen(true)}
                    sx={{ fontWeight: "600" }}
                  >
                    New Ticket
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadTickets}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={exportTickets}
                    disabled={filteredTickets.length === 0}
                  >
                    Export
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Tickets Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ p: 3 }}>
                {/* Header with Filters */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        My Support Tickets
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Manage and track all your support requests
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        size="small"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ minWidth: 200 }}
                      />
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
                    </Box>
                  </Box>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 1 }}
                    onClose={() => dispatch(clearTicketErrors())}
                  >
                    {typeof error === "string"
                      ? error
                      : error.message || "An error occurred"}
                  </Alert>
                )}

                {loading && <LinearProgress sx={{ mb: 2 }} />}

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress size={50} />
                  </Box>
                ) : filteredTickets.length === 0 ? (
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
                      {searchTerm ||
                      statusFilter !== "ALL" ||
                      priorityFilter !== "ALL"
                        ? "No matching tickets found"
                        : "No tickets yet"}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {searchTerm ||
                      statusFilter !== "ALL" ||
                      priorityFilter !== "ALL"
                        ? "Try adjusting your search or filters to see more results."
                        : "Create your first support ticket to get started with our support system"}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => setCreateTicketOpen(true)}
                      sx={{ borderRadius: 1, px: 3, py: 1 }}
                    >
                      Create Your First Ticket
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {filteredTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        user={user}
                        onStatusUpdate={handleStatusUpdate}
                        onAddComment={(ticket) => {
                          setSelectedTicket(ticket);
                          setCommentDialogOpen(true);
                        }}
                        updating={updating}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Create Ticket Dialog */}
      <CreateTicket
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        onSuccess={() => {
          setCreateTicketOpen(false);
          showSnackbar("Ticket created successfully");
          loadTickets();
        }}
      />

      {/* Add Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => {
          setCommentDialogOpen(false);
          setNewComment("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="600">
            Add Comment
          </Typography>
          {selectedTicket && (
            <Typography variant="body2" color="text.secondary">
              Ticket: {selectedTicket.subject}
            </Typography>
          )}
        </DialogTitle>
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
            placeholder="Type your comment here..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setCommentDialogOpen(false);
              setNewComment("");
            }}
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim()}
            startIcon={<Send />}
            sx={{ borderRadius: 1 }}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
