import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register(username, email, password) {
    const response = await API.post("/api/auth/register", { username, email, password });
    if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
}

export async function login(email, password) {
    const response = await API.post("/api/auth/login", { email, password });
    if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
}

export async function logout() {
    try {
        const response = await API.get("/api/auth/logout");
        return response.data;
    } finally {
        localStorage.removeItem("token");
    }
}

export async function getMe() {
    const response = await API.get("/api/auth/get-me");
    return response.data;
}