import axios from "axios";
import config from "../Config";

const API_URL = config.API_URL;

const axiosClient = axios.create({
    baseURL: API_URL,
});

// 🔥 FIX 1: Token attach automatically for all requests
axiosClient.interceptors.request.use((req) => {
    const token = localStorage.getItem("auth_token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const getRole = () => JSON.parse(localStorage.getItem("user"))?.role;
const isAdmin = () => getRole() === "admin";

/* =======================================================
📌 1. GET DOCTORS (NOW WITH TOKEN)
======================================================= */
const getDoctors = ({ page = 1, limit = 10, orderBy = "createdAt", order = "DESC", search = "" }) => {
    return axiosClient
        .get("api/doctors/doctors", {
            params: { page, limit, orderBy, order, search }
        })
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Failed to fetch doctors" });
};


const getDoctorById = (id) => {
    return axiosClient
        .get(`api/doctors/doctors/${id}`)
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Doctor not found" });
};

const createDoctor = (payload) => {
    if (!isAdmin()) return Promise.reject({ message: "Admin Only Access ❌" });

    return axiosClient
        .post("api/doctors/create-doctor", payload)
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Create Failed" });
};

const updateDoctor = (id, payload) => {
    if (!isAdmin()) return Promise.reject({ message: "Admin Only Access ❌" });

    return axiosClient
        .patch(`api/doctors/doctors/${id}`, payload)
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Update Failed" });
};

const deleteDoctor = (id) => {
    if (!isAdmin()) return Promise.reject({ message: "Admin Only Access ❌" });

    return axiosClient
        .delete(`api/doctors/doctors/${id}`)
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Delete Failed" });
};

const getDepartments = ({ search = "", sort = "asc" } = {}) => {
    return axiosClient
        .get("/api/departments", {
            params: { search, sort }
        })
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Failed to load departments" });
};

const getSpecializations = () => {
    return axiosClient
        .get("/api/specializations")
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Failed to load specializations" });
};

const getDegrees = ({ search = "", sort = "asc", page = 1, limit = 20 } = {}) => {
    return axiosClient
        .get("/api/degrees", {
            params: { search, sort, page, limit }
        })
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Failed to load degrees" });
};

const getDoctorNames  = ({ search = "", sort = "asc" } = {}) => {
    return axiosClient
        .get("/api/doctors/names", {
            params: { search, sort }
        })
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Failed to load doctor names" });
};

/* EXPORT LIKE authService */
const doctorService = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDepartments,
    getSpecializations,
    getDegrees,
    getDoctorNames,
};

export default doctorService;
