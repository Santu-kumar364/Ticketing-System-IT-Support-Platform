// components/Dashboard/CreateTicket.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { createTicket } from "../../redux/Ticket/ticket.action";

export default function CreateTicket({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { creating } = useSelector((store) => store.ticket);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(createTicket(formData));
      onSuccess();
      setFormData({ subject: '', description: '', priority: 'MEDIUM' });
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ subject: '', description: '', priority: 'MEDIUM' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Create New Support Ticket
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <TextField
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
              fullWidth
              placeholder="Brief description of your issue"
            />
            
            <TextField
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              fullWidth
              placeholder="Please provide detailed information about your issue..."
            />
            
            <TextField
              select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              fullWidth
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="URGENT">Urgent</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading || !formData.subject || !formData.description}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Ticket'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}