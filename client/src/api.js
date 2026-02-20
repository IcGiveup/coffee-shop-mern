import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://coffee-shop-mern.onrender.com",
});

export default API;