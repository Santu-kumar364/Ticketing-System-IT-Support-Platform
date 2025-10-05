// redux/Auth/auth.reducer.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  LOGOUT,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  CLEAR_AUTH_ERROR,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
} from "./auth.action.Type";

const initialState = {
  // Authentication state
  jwt: localStorage.getItem("jwt"),
  error: null,
  loading: false,
  user: null,
  isAuthenticated: !!localStorage.getItem("jwt"),
  lastAction: null,
  
  // User management state (for admin)
  allUsers: [],
  usersLoading: false,
  usersError: null,
  
  // Profile state
  profileLoading: false,
  profileError: null,

  // User creation state
  creatingUser: false,
  createUserError: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Authentication cases
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        lastAction: action.type,
      };

    case CREATE_USER_REQUEST:
      return {
        ...state,
        creatingUser: true,
        createUserError: null,
        lastAction: action.type,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        creatingUser: false,
        createUserError: null,
        allUsers: [...state.allUsers, action.payload],
        lastAction: action.type,
      };

    case CREATE_USER_FAILURE:
      return {
        ...state,
        creatingUser: false,
        createUserError: action.payload,
        lastAction: action.type,
      };

    case GET_PROFILE_REQUEST:
      return {
        ...state,
        profileLoading: true,
        profileError: null,
        lastAction: action.type,
      };

    case GET_PROFILE_SUCCESS:
      console.log("Profile success in reducer:", action.payload);
      return { 
        ...state, 
        user: action.payload, 
        profileLoading: false, 
        profileError: null,
        isAuthenticated: true,
        lastAction: action.type,
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      console.log("Auth success in reducer:", action.payload);
      return {
        ...state,
        jwt: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
        lastAction: action.type,
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        lastAction: action.type,
      };

    case GET_PROFILE_FAILURE:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload,
        lastAction: action.type,
      };

    case LOGOUT:
      localStorage.removeItem("jwt");
      return {
        ...initialState,
        jwt: null,
        user: null,
        isAuthenticated: false,
        lastAction: action.type,
      };

    // User Management cases (Admin)
    case GET_ALL_USERS_REQUEST:
      return {
        ...state,
        usersLoading: true,
        usersError: null,
        lastAction: action.type,
      };

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        allUsers: action.payload,
        usersLoading: false,
        usersError: null,
        lastAction: action.type,
      };

    case GET_ALL_USERS_FAILURE:
      return {
        ...state,
        usersLoading: false,
        usersError: action.payload,
        lastAction: action.type,
      };

    case UPDATE_USER_ROLE_REQUEST:
    case DELETE_USER_REQUEST:
      return {
        ...state,
        usersLoading: true,
        usersError: null,
        lastAction: action.type,
      };

    case UPDATE_USER_ROLE_SUCCESS:
      // Update the user in allUsers array
      const updatedUsers = state.allUsers.map(user =>
        user.id === action.payload.id ? action.payload : user
      );
      return {
        ...state,
        allUsers: updatedUsers,
        usersLoading: false,
        usersError: null,
        lastAction: action.type,
      };

    case DELETE_USER_SUCCESS:
      // Remove user from allUsers array
      const filteredUsers = state.allUsers.filter(
        user => user.id !== action.payload.userId
      );
      return {
        ...state,
        allUsers: filteredUsers,
        usersLoading: false,
        usersError: null,
        lastAction: action.type,
      };

    case UPDATE_USER_ROLE_FAILURE:
    case DELETE_USER_FAILURE:
      return {
        ...state,
        usersLoading: false,
        usersError: action.payload,
        lastAction: action.type,
      };

    // Clear errors
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
        usersError: null,
        profileError: null,
        createUserError: null,
        lastAction: action.type,
      };

    default:
      return state;
  }
};