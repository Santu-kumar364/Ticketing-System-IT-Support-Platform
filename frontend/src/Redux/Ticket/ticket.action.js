// redux/Ticket/ticket.action.js
import { API_BASE_URL } from "../../config/Api";
import {
  CREATE_TICKET_REQUEST,
  CREATE_TICKET_SUCCESS,
  CREATE_TICKET_FAILURE,
  GET_USER_TICKETS_REQUEST,
  GET_USER_TICKETS_SUCCESS,
  GET_USER_TICKETS_FAILURE,
  GET_ALL_TICKETS_REQUEST,
  GET_ALL_TICKETS_SUCCESS,
  GET_ALL_TICKETS_FAILURE,
  GET_ASSIGNED_TICKETS_REQUEST,
  GET_ASSIGNED_TICKETS_SUCCESS,
  GET_ASSIGNED_TICKETS_FAILURE,
  UPDATE_TICKET_STATUS_REQUEST,
  UPDATE_TICKET_STATUS_SUCCESS,
  UPDATE_TICKET_STATUS_FAILURE,
  ASSIGN_TICKET_REQUEST,
  ASSIGN_TICKET_SUCCESS,
  ASSIGN_TICKET_FAILURE,
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAILURE,
  DELETE_TICKET_REQUEST,
  DELETE_TICKET_SUCCESS,
  DELETE_TICKET_FAILURE,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
} from "./ticket.action.Type";
import axios from "axios";

// Create Ticket
export const createTicket = (ticketData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TICKET_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.post(
      `${API_BASE_URL}api/tickets`,
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: CREATE_TICKET_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: CREATE_TICKET_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Get User Tickets
export const getUserTickets = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_TICKETS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}api/tickets/my-tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: GET_USER_TICKETS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: GET_USER_TICKETS_FAILURE,
      payload: errorMessage,
    });
  }
};

// Get All Tickets (for Admin/Support)
export const getAllTickets = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_TICKETS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}api/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: GET_ALL_TICKETS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: GET_ALL_TICKETS_FAILURE,
      payload: errorMessage,
    });
  }
};

export const getAssignedTickets = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ASSIGNED_TICKETS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}api/tickets/assigned`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Assigned tickets API response:", data); // Debug log

    dispatch({ type: GET_ASSIGNED_TICKETS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error fetching assigned tickets:", errorMessage); // Debug log
    dispatch({
      type: GET_ASSIGNED_TICKETS_FAILURE,
      payload: errorMessage,
    });
  }
};

export const updateTicketStatus = (ticketId, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TICKET_STATUS_REQUEST });

    const token = localStorage.getItem("jwt");

    // Send status as direct value, not wrapped in object
    const { data } = await axios.put(
      `${API_BASE_URL}api/tickets/${ticketId}/status`,
      status, // Send the status value directly
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: UPDATE_TICKET_STATUS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: UPDATE_TICKET_STATUS_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};
// Get comments for a ticket
export const getTicketComments = (ticketId) => async (dispatch) => {
  try {
    dispatch({ type: GET_COMMENTS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(
      `${API_BASE_URL}api/tickets/${ticketId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: GET_COMMENTS_SUCCESS,
      payload: { ticketId, comments: data },
    });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: GET_COMMENTS_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Create Comment
export const createComment = (ticketId, content) => async (dispatch) => {
  try {
    dispatch({ type: ADD_COMMENT_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.post(
      `${API_BASE_URL}api/tickets/${ticketId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: ADD_COMMENT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: ADD_COMMENT_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Delete Ticket
export const deleteTicket = (ticketId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TICKET_REQUEST });

    const token = localStorage.getItem("jwt");
    await axios.delete(`${API_BASE_URL}api/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: DELETE_TICKET_SUCCESS, payload: ticketId });
    return ticketId;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: DELETE_TICKET_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Assign Ticket to Agent
export const assignTicket = (ticketId, agentId) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_TICKET_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}api/tickets/${ticketId}/assign/${agentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: ASSIGN_TICKET_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: ASSIGN_TICKET_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

export const assignTicketToAgent =
  (ticketId, agentId, note) => async (dispatch) => {
    try {
      dispatch({ type: ASSIGN_TICKET_REQUEST });

      const token = localStorage.getItem("jwt");
      const { data } = await axios.put(
        `${API_BASE_URL}api/tickets/${ticketId}/assign/${agentId}`, // Match your backend
        {}, // Empty body since your backend expects path variables
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({ type: ASSIGN_TICKET_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      dispatch({
        type: ASSIGN_TICKET_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

// Get Ticket by ID
export const getTicketById = (ticketId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_TICKETS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}api/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: GET_USER_TICKETS_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Update Ticket (General update)
export const updateTicket = (ticketId, updateData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TICKET_STATUS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}api/tickets/${ticketId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: UPDATE_TICKET_STATUS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: UPDATE_TICKET_STATUS_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Get Tickets by Status
export const getTicketsByStatus = (status) => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_TICKETS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(
      `${API_BASE_URL}api/tickets?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: GET_ALL_TICKETS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: GET_ALL_TICKETS_FAILURE,
      payload: errorMessage,
    });
  }
};

// Get Tickets by Priority
export const getTicketsByPriority = (priority) => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_TICKETS_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.get(
      `${API_BASE_URL}api/tickets?priority=${priority}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: GET_ALL_TICKETS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: GET_ALL_TICKETS_FAILURE,
      payload: errorMessage,
    });
  }
};

// Unassign Ticket
export const unassignTicket = (ticketId) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_TICKET_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}api/tickets/${ticketId}/unassign`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: ASSIGN_TICKET_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch({
      type: ASSIGN_TICKET_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Clear Ticket Errors
export const clearTicketErrors = () => (dispatch) => {
  dispatch({
    type: CREATE_TICKET_FAILURE,
    payload: null,
  });
  dispatch({
    type: GET_USER_TICKETS_FAILURE,
    payload: null,
  });
  dispatch({
    type: GET_ALL_TICKETS_FAILURE,
    payload: null,
  });
  dispatch({
    type: UPDATE_TICKET_STATUS_FAILURE,
    payload: null,
  });
  dispatch({
    type: ASSIGN_TICKET_FAILURE,
    payload: null,
  });
  dispatch({
    type: ADD_COMMENT_FAILURE,
    payload: null,
  });
  dispatch({
    type: DELETE_TICKET_FAILURE,
    payload: null,
  });
};
