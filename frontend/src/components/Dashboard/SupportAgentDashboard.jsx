// components/Dashboard/SupportAgentDashboard.jsx
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
  Tab,
  Tabs,
  Tooltip,
  Snackbar,
  InputAdornment,
  CardHeader,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
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
  Email,
  CalendarToday,
  Search,
  Download,
  Visibility,
  MoreVert,
  AutoAwesome,
  TaskAlt,
  PendingActions,
  Warning,
  Notifications,
  Settings,
  Help,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import {
  getAssignedTickets,
  getAllTickets,
  updateTicketStatus,
  createComment,
  assignTicketToAgent,
  getTicketById,
  clearTicketErrors,
} from "../../redux/Ticket/ticket.action";
import { logoutAction } from "../../Redux/Auth/auth.action";

// Ticket Card Component for better organization
const TicketCard = React.memo(({ 
  ticket, 
  user, 
  activeTab, 
  onStatusUpdate, 
  onAddComment, 
  onViewDetails,
  updating,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "primary";
      case "IN_PROGRESS": return "warning";
      case "RESOLVED": return "success";
      case "CLOSED": return "default";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "OPEN": return <Assignment color="primary" />;
      case "IN_PROGRESS": return <AccessTime color="warning" />;
      case "RESOLVED": return <CheckCircle color="success" />;
      case "CLOSED": return <Cancel color="default" />;
      default: return <Assignment />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "LOW": return <LowPriority color="success" />;
      case "MEDIUM": return <PriorityHigh color="warning" />;
      case "HIGH": return <Whatshot color="error" />;
      case "URGENT": return <Warning color="error" />;
      default: return <PriorityHigh />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW": return "success";
      case "MEDIUM": return "warning";
      case "HIGH": return "error";
      case "URGENT": return "error";
      default: return "default";
    }
  };

  const isAssignedToMe = ticket.assignedAgent?.id === user.id;
  const isUnassigned = !ticket.assignedAgent;

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
              <Typography variant="h6" component="h2" fontWeight="600" sx={{ flex: 1 }}>
                {ticket.subject}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MoreVert />
              </IconButton>
            </Box>
            
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
                icon={<Person sx={{ fontSize: 14 }} />}
                label={`${ticket.createdBy?.firstName} ${ticket.createdBy?.lastName}`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                label={new Date(ticket.createdAt).toLocaleDateString()}
                size="small"
                variant="outlined"
              />
              {ticket.assignedAgent && (
                <Chip
                  icon={<AssignmentInd sx={{ fontSize: 14 }} />}
                  label={`${ticket.assignedAgent.firstName} ${ticket.assignedAgent.lastName}`}
                  color={isAssignedToMe ? "primary" : "default"}
                  size="small"
                />
              )}
              {isUnassigned && (
                <Chip
                  label="Unassigned"
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
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 0.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 28, height: 28, fontSize: "0.7rem", bgcolor: "primary.main" }}>
                      {comment.user?.firstName?.[0]}{comment.user?.lastName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2">{comment.content}</Typography>}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {comment.user?.firstName} {comment.user?.lastName} • {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mt: 2 }}>
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

            {/* Status Update Buttons - Only for tickets assigned to this agent */}
            {isAssignedToMe && (
              <>
                {ticket.status === "OPEN" && (
                  <Tooltip title="Start working on this ticket">
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={() => onStatusUpdate(ticket.id, "IN_PROGRESS")}
                      disabled={updating}
                      startIcon={<AccessTime />}
                      sx={{ borderRadius: 1 }}
                    >
                      Start
                    </Button>
                  </Tooltip>
                )}

                {ticket.status === "IN_PROGRESS" && (
                  <Tooltip title="Mark ticket as resolved">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onStatusUpdate(ticket.id, "RESOLVED")}
                      disabled={updating}
                      startIcon={<CheckCircle />}
                      sx={{ borderRadius: 1 }}
                    >
                      Resolve
                    </Button>
                  </Tooltip>
                )}

                {ticket.status === "RESOLVED" && (
                  <Tooltip title="Close this ticket">
                    <Button
                      size="small"
                      variant="contained"
                      color="default"
                      onClick={() => onStatusUpdate(ticket.id, "CLOSED")}
                      disabled={updating}
                      startIcon={<Cancel />}
                      sx={{ borderRadius: 1 }}
                    >
                      Close
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
          </Stack>

          <Stack spacing={0.5} alignItems="flex-end">
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
            </Typography>
            {ticket.comments && ticket.comments.length > 0 && (
              <Badge badgeContent={ticket.comments.length} color="primary" size="small">
                <CommentIcon color="action" fontSize="small" />
              </Badge>
            )}
          </Stack>
        </Box>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { onViewDetails(ticket); setMenuAnchor(null); }}>
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => { onAddComment(ticket); setMenuAnchor(null); }}>
          <CommentIcon sx={{ mr: 1 }} /> Add Comment
        </MenuItem>
        {isAssignedToMe && ticket.status !== "CLOSED" && (
          <MenuItem onClick={() => { onStatusUpdate(ticket.id, "CLOSED"); setMenuAnchor(null); }}>
            <Cancel sx={{ mr: 1 }} /> Close Ticket
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
});

export default function SupportAgentDashboard() {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const auth  = useSelector((store) => store.auth);
  const { tickets, loading, error, updating } = useSelector((store) => store.ticket);

  const user = auth.user || {};

  // Load data on component mount - Load ALL tickets initially
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (!initialLoad) {
      loadData();
    }
  }, [activeTab]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearTicketErrors());
    };
  }, [dispatch]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Load initial data - always load ALL tickets first
  const loadInitialData = async () => {
    try {
      console.log("Loading initial data - ALL tickets");
      await dispatch(getAllTickets());
      setInitialLoad(false);
    } catch (error) {
      console.error("Failed to load initial tickets:", error);
      showSnackbar("Failed to load tickets", "error");
      setInitialLoad(false);
    }
  };

  // Load data based on active tab
  const loadData = async () => {
    try {
      if (activeTab === 0) {
        console.log("Loading assigned tickets for My Tickets tab");
        // For "My Tickets" tab, we can filter from existing tickets or fetch assigned
        // Using existing tickets and filtering is more efficient
      } else {
        console.log("Loading all tickets for All Tickets tab");
        await dispatch(getAllTickets());
      }
    } catch (error) {
      console.error("Failed to load tickets:", error);
      showSnackbar("Failed to load tickets", "error");
    }
  };

  // Force reload all tickets
  const reloadAllTickets = async () => {
    try {
      await dispatch(getAllTickets());
      showSnackbar("Tickets refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh tickets:", error);
      showSnackbar("Failed to refresh tickets", "error");
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
      reloadAllTickets(); // Reload to get updated comments
    } catch (error) {
      console.error("Failed to add comment:", error);
      showSnackbar("Failed to add comment", "error");
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await dispatch(updateTicketStatus(ticketId, newStatus));
      showSnackbar(`Ticket status updated to ${newStatus}`);
      reloadAllTickets(); // Reload to get updated status
    } catch (error) {
      console.error("Failed to update status:", error);
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleViewDetails = async (ticket) => {
    try {
      const details = await dispatch(getTicketById(ticket.id));
      setTicketDetails(details);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Failed to load ticket details:", error);
      showSnackbar("Failed to load ticket details", "error");
    }
  };

  // Memoized calculations for better performance
  const { currentTickets, filteredTickets, stats } = useMemo(() => {
    console.log("Filtering tickets - Active Tab:", activeTab, "Total Tickets:", tickets?.length);
    
    // FIXED: Tab 0 (My Tickets) shows only assigned tickets, Tab 1 (All Tickets) shows all tickets
    const currentTickets = activeTab === 0 
      ? (tickets?.filter(ticket => ticket.assignedAgent?.id === user.id) || [])
      : (tickets || []);
    
    console.log("Current tickets after filtering:", currentTickets.length);

    const filteredTickets = currentTickets.filter((ticket) => {
      const statusMatch = statusFilter === "ALL" || ticket.status === statusFilter;
      const priorityMatch = priorityFilter === "ALL" || ticket.priority === priorityFilter;
      const searchMatch = !searchTerm || 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && priorityMatch && searchMatch;
    });

    const myAssignedTickets = tickets?.filter((t) => t.assignedAgent?.id === user.id) || [];
    const stats = {
      assigned: myAssignedTickets.length,
      open: myAssignedTickets.filter((t) => t.status === "OPEN").length,
      inProgress: myAssignedTickets.filter((t) => t.status === "IN_PROGRESS").length,
      resolved: myAssignedTickets.filter((t) => t.status === "RESOLVED").length,
      closed: myAssignedTickets.filter((t) => t.status === "CLOSED").length,
      totalAssigned: myAssignedTickets.length,
      totalAllTickets: tickets?.length || 0,
    };

    return { currentTickets, filteredTickets, stats };
  }, [tickets, activeTab, statusFilter, priorityFilter, searchTerm, user.id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setSearchTerm("");
  };

  const exportTickets = () => {
    const csvData = filteredTickets.map(ticket => ({
      ID: ticket.id,
      Subject: ticket.subject,
      Status: ticket.status,
      Priority: ticket.priority,
      'Created By': `${ticket.createdBy?.firstName} ${ticket.createdBy?.lastName}`,
      'Assigned To': ticket.assignedAgent ? `${ticket.assignedAgent.firstName} ${ticket.assignedAgent.lastName}` : 'Unassigned',
      'Created Date': new Date(ticket.createdAt).toLocaleDateString(),
      'Last Updated': new Date(ticket.updatedAt).toLocaleDateString(),
    }));
    
    // Simple CSV export implementation
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showSnackbar("Tickets exported successfully");
  };

  if (auth?.loading || initialLoad) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Support Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
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
              icon={<TaskAlt />}
              label={`Support Agent`} 
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
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "primary.main", color: "white" }}>
                  <Typography variant="h4" fontWeight="700">{stats.totalAssigned}</Typography>
                  <Typography variant="body2">Total Assigned</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "info.main", color: "white" }}>
                  <Typography variant="h4" fontWeight="700">{stats.open}</Typography>
                  <Typography variant="body2">Open</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.main", color: "white" }}>
                  <Typography variant="h4" fontWeight="700">{stats.inProgress}</Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.main", color: "white" }}>
                  <Typography variant="h4" fontWeight="700">{stats.resolved}</Typography>
                  <Typography variant="body2">Resolved</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your support tickets efficiently
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button variant="contained" startIcon={<Refresh />} onClick={reloadAllTickets} disabled={loading}>
                    Refresh All
                  </Button>
                  <Button variant="outlined" startIcon={<Download />} onClick={exportTickets} disabled={filteredTickets.length === 0}>
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
                {/* Header with Tabs and Filters */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
                    <Typography variant="h4" fontWeight="700">
                      Support Tickets
                    </Typography>
                    
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        size="small"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        }}
                        sx={{ minWidth: 200 }}
                      />
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                          <MenuItem value="ALL">All Status</MenuItem>
                          <MenuItem value="OPEN">Open</MenuItem>
                          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                          <MenuItem value="RESOLVED">Resolved</MenuItem>
                          <MenuItem value="CLOSED">Closed</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                          <MenuItem value="ALL">All Priority</MenuItem>
                          <MenuItem value="LOW">Low</MenuItem>
                          <MenuItem value="MEDIUM">Medium</MenuItem>
                          <MenuItem value="HIGH">High</MenuItem>
                          <MenuItem value="URGENT">Urgent</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab 
                      icon={<AssignmentInd />} 
                      label={`Assigned Tickets (${stats.totalAssigned})`} 
                      iconPosition="start" 
                    />
                    <Tab 
                      icon={<Group />} 
                      label={`All Tickets (${stats.totalAllTickets})`} 
                      iconPosition="start" 
                    />
                  </Tabs>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }} onClose={() => dispatch(clearTicketErrors())}>
                    {typeof error === "string" ? error : error.message || "An error occurred"}
                  </Alert>
                )}

                {loading && <LinearProgress sx={{ mb: 2 }} />}

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress size={50} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      Loading tickets...
                    </Typography>
                  </Box>
                ) : filteredTickets.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <BugReport sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                      No tickets found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {activeTab === 0 
                        ? "You don't have any assigned tickets yet." 
                        : "No tickets match your current filters. Try adjusting your search or filters."}
                    </Typography>
                    <Button variant="outlined" onClick={reloadAllTickets} startIcon={<Refresh />}>
                      Refresh Tickets
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {filteredTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        user={user}
                        activeTab={activeTab}
                        onStatusUpdate={handleStatusUpdate}
                        onAddComment={(ticket) => { setSelectedTicket(ticket); setCommentDialogOpen(true); }}
                        onViewDetails={handleViewDetails}
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

      {/* Add Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => { setCommentDialogOpen(false); setNewComment(""); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="600">Add Comment</Typography>
          {selectedTicket && (
            <Typography variant="body2" color="text.secondary">Ticket: {selectedTicket.subject}</Typography>
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
          <Button onClick={() => { setCommentDialogOpen(false); setNewComment(""); }} sx={{ borderRadius: 1 }}>
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

      {/* Ticket Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">Ticket Details</Typography>
        </DialogTitle>
        <DialogContent>
          {ticketDetails && (
            <Stack spacing={2}>
              <Typography variant="h5">{ticketDetails.subject}</Typography>
              <Typography variant="body1">{ticketDetails.description}</Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip label={`Status: ${ticketDetails.status}`} color="primary" />
                <Chip label={`Priority: ${ticketDetails.priority}`} variant="outlined" />
                <Chip label={`Created: ${new Date(ticketDetails.createdAt).toLocaleDateString()}`} />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
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