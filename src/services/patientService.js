import axios from "axios";
import config from "../Config";

const API_URL = config.API_URL;

const axiosClient = axios.create({
    baseURL: API_URL,
});

// 🔥 Attach token
axiosClient.interceptors.request.use((req) => {
    const token = localStorage.getItem("auth_token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const getRole = () => JSON.parse(localStorage.getItem("user"))?.role;
const isAdmin = () => getRole() === "admin";

/* =======================================================
📌 GET ALL PATIENTS
======================================================= */
const getPatients = ({ page = 1, limit = 10, orderBy = "createdAt", order = "DESC", search = "" }) => {
    return axiosClient
        .get("/api/patients/patients", {
            params: { page, limit, orderBy, order, search }
        })
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Failed to fetch patients" });
};

const getPatientById = (id) => {
    return axiosClient
        .get(`/api/patients/patients/${id}`)
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Patient not found" });
};

const createPatient = (payload) => {
    if (!isAdmin()) return Promise.reject({ message: "Admin Only Access ❌" });

    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
        if (key !== "documents") {
            formData.append(key, payload[key]);
        }
    });

    if (payload.documents?.length > 0) {
        payload.documents.forEach(file => {
            formData.append("documents", file);
        });
    }

    return axiosClient
        .post("/api/patients/patients", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => res.data)
        .catch(err => err.response?.data || { message: "Create Failed" });
};

const updatePatient = async (id, payload) => {
    if (!isAdmin()) throw new Error("Admin Only Access ❌");

    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
        if (key === "documents") return;

        let value = payload[key];

        if (key === "ipd" && value) {
            if (!value.doctor) delete value.doctor; // IMPORTANT FIX
        }
        if (key === "opd" && value) {
            if (!value.doctor) delete value.doctor; // IMPORTANT FIX
        }

        if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value ?? "");
        }
    });

    if (payload.documents?.length > 0) {
        payload.documents.forEach((file) => formData.append("documents", file));
    }

    try {
        const res = await axiosClient.patch(
            `/api/patients/patients/${id}`,
            formData
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Update failed");
    }
};


/* =======================================================
📌 DELETE PATIENT
======================================================= */
const deletePatient = async (id) => {
    if (!isAdmin()) throw new Error("Admin Only Access ❌");
    try {
        const res = await axiosClient.delete(`/api/patients/patients/${id}`);
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Delete failed");
    }
};


/* =======================================================
📌 GET DOCTOR SPECIALIZATIONS (CSV BASED)
======================================================= */


const patientService = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
};

export default patientService;
