// redux/Ticket/ticket.reducer.js
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
  UPDATE_TICKET_STATUS_REQUEST,
  UPDATE_TICKET_STATUS_SUCCESS,
  UPDATE_TICKET_STATUS_FAILURE,
  ASSIGN_TICKET_REQUEST,
  ASSIGN_TICKET_SUCCESS,
  ASSIGN_TICKET_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  DELETE_TICKET_SUCCESS,
  DELETE_TICKET_REQUEST,
  DELETE_TICKET_FAILURE,
} from "./ticket.action.Type";

const initialState = {
  tickets: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
};

export const ticketReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TICKET_REQUEST:
      return {
        ...state,
        creating: true,
        createError: null,
      };

    case CREATE_TICKET_SUCCESS:
      return {
        ...state,
        creating: false,
        createError: null,
        tickets: [action.payload, ...state.tickets],
      };

    case CREATE_TICKET_FAILURE:
      return {
        ...state,
        creating: false,
        createError: action.payload,
      };

    case GET_USER_TICKETS_REQUEST:
    case GET_ALL_TICKETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USER_TICKETS_SUCCESS:
    case GET_ALL_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        tickets: action.payload,
      };

    case GET_USER_TICKETS_FAILURE:
    case GET_ALL_TICKETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        tickets: [],
      };

    case UPDATE_TICKET_STATUS_REQUEST:
    case ASSIGN_TICKET_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case UPDATE_TICKET_STATUS_SUCCESS:
    case ASSIGN_TICKET_SUCCESS:
      return {
        ...state,
        updating: false,
        error: null,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.payload.id ? action.payload : ticket
        ),
      };

    case UPDATE_TICKET_STATUS_FAILURE:
    case ASSIGN_TICKET_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        updating: false,
        error: null,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.payload.id ? action.payload : ticket
        ),
      };

    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    case DELETE_TICKET_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case DELETE_TICKET_SUCCESS:
      return {
        ...state,
        updating: false,
        error: null,
        tickets: state.tickets.filter((ticket) => ticket.id !== action.payload),
      };

    case DELETE_TICKET_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
