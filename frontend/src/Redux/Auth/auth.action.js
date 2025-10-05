import { API_BASE_URL } from "../../config/Api";
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
import axios from "axios";

// Helper function to extract serializable error info
const getSerializableError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || error.message,
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: "No response from server",
      status: null,
      statusText: "Network Error",
    };
  } else {
    // Something else happened
    return {
      message: error.message,
      status: null,
      statusText: "Request Error",
    };
  }
};

// Login User
export const loginUserAction = (loginData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await axios.post(`${API_BASE_URL}auth/signin`, loginData);

    if (data.token) {
      localStorage.setItem("jwt", data.token);
      console.log("JWT token stored:", data.token);
    }

    console.log("Login success:", data);

    // Dispatch login success with both token and user data
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: data.token,
        user: data.user, // User data comes from backend response
      },
    });

    return data; // Return data for component to use
  } catch (error) {
    console.error("Login error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const serializableError = getSerializableError(error);
    dispatch({
      type: LOGIN_FAILURE,
      payload: serializableError,
    });
    throw error;
  }
};

// Register User
export const registerUserAction = (registerData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });
    const { data } = await axios.post(
      `${API_BASE_URL}auth/signup`,
      registerData
    );

    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }
    console.log("Register success:", data);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        token: data.jwt,
        user: data.user,
      },
    });
    return data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);

    const serializableError = getSerializableError(error);
    dispatch({
      type: REGISTER_FAILURE,
      payload: serializableError,
    });
    throw error;
  }
};

// Get User Profile
export const getProfileAction = (jwt) => async (dispatch) => {
  try {
    dispatch({ type: GET_PROFILE_REQUEST });

    const token = jwt || localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const { data } = await axios.get(`${API_BASE_URL}api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Profile data received:", data);
    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.log("Profile error:", error);

    const serializableError = getSerializableError(error);
    dispatch({ type: GET_PROFILE_FAILURE, payload: serializableError });
    throw error;
  }
};

// Logout User
export const logoutAction = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT, payload: "User logged out" });
};

// Clear Auth Errors
export const clearAuthErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_ERROR });
};

// Verify Token Validity
export const verifyToken = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: LOGOUT });
      return false;
    }

    // Try to get profile to verify token
    await dispatch(getProfileAction(token));
    return true;
  } catch (error) {
    // Token is invalid, logout user
    dispatch(logoutAction());
    return false;
  }
};

// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: GET_PROFILE_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}api/users/profile`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const serializableError = getSerializableError(error);
    dispatch({ type: GET_PROFILE_FAILURE, payload: serializableError });
    throw error;
  }
};

// Update User Role (Admin only)
export const updateUserRole = (userId, role) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_ROLE_REQUEST });

    const token = localStorage.getItem("jwt");
    const { data } = await axios.put(
      `${API_BASE_URL}api/users/${userId}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const serializableError = getSerializableError(error);
    dispatch({
      type: UPDATE_USER_ROLE_FAILURE,
      payload: serializableError,
    });
    throw error;
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const token = localStorage.getItem("jwt");

    const { data } = await axios.delete(
      `${API_BASE_URL}api/admin/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: { userId, message: data.message || "User deleted successfully" },
    });

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Failed to delete user";

    console.error("Delete user error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    dispatch({
      type: DELETE_USER_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// In getAllUsers action, add logging:
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });
    console.log("Fetching all users...");

    const token = localStorage.getItem("jwt");
    console.log("Using token:", token ? "Token exists" : "No token");

    const { data } = await axios.get(`${API_BASE_URL}api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Users fetched successfully:", data);
    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error fetching users:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const serializableError = getSerializableError(error);
    dispatch({
      type: GET_ALL_USERS_FAILURE,
      payload: serializableError,
    });
    throw error;
  }
};

// In createUserAction, add logging:
export const createUserAction = (userData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_USER_REQUEST });
    console.log("Creating user with data:", userData);

    const token = localStorage.getItem("jwt");
    const { data } = await axios.post(
      `${API_BASE_URL}api/admin/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User created successfully:", data);
    dispatch({ type: CREATE_USER_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error creating user:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const serializableError = getSerializableError(error);
    dispatch({
      type: CREATE_USER_FAILURE,
      payload: serializableError,
    });
    throw error;
  }
};
