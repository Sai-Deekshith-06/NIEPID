import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000" : "/api",
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
});