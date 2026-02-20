// FIYAZ AHMED
import API from "../api";

export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "USER_LOGIN_REQUEST" });

    const response = await API.post("/api/users/login", userData);

    dispatch({ type: "USER_LOGIN_SUCCESS", payload: response.data });
    localStorage.setItem("currentUser", JSON.stringify(response.data));

  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    dispatch({
      type: "USER_LOGIN_FAILED",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: "USER_LOGOUT" });
  localStorage.removeItem("currentUser");
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "USER_REGISTER_REQUEST" });

    const response = await API.post("/api/users/register", userData);

    dispatch({ type: "USER_REGISTER_SUCCESS", payload: response.data });

  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);

    dispatch({
      type: "USER_REGISTER_FAILED",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const fetchCoffees = (branchId) => async (dispatch) => {
  try {
    dispatch({ type: "COFFEE_FETCH_REQUEST" });

    const url = branchId
      ? `/api/coffees?branchId=${encodeURIComponent(branchId)}`
      : "/api/coffees";

    const response = await API.get(url);

    dispatch({ type: "COFFEE_FETCH_SUCCESS", payload: response.data });

  } catch (error) {
    dispatch({
      type: "COFFEE_FETCH_FAILED",
      payload: error.response?.data?.message || error.message,
    });
  }
};
