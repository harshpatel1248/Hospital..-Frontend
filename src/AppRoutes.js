import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./feature/auth/Login";
import Dashboard from "./feature/Dashboard/Dashboard";
import Profile from "./feature/profile/Profile";
import AddEditDoctor from "./feature/doctor/AddEditDoctor";
import DoctorOnbordingList from "./feature/doctor/DoctorOnbordingList";
import RecipientOnboarding from "./feature/Recipient/RecipientOnbording";
import AddEditRecipient from "./feature/Recipient/AddEditRecipient";
import PatitentOnbordingList from "./feature/patitent/PatitentOnbordingList";
import AddEditPatient from "./feature/patitent/AddEditPatient";
import PatientView from "./feature/patitent/PatientView";

// Layouts
import MainLayout from "./feature/comman/MainLayout";
import Public from "./feature/comman/Public";
import PrivateRoute from "./feature/comman/PrivateRoute";
import ResetPassword from "./feature/auth/ResetPassword";
import ForgotPassword from "./feature/auth/ForgotPassword";

export function AppRoutes() {
    return (
        <Routes>
            {/* 🔐 Protected Routes (Login required) */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/add-edit-doctor" element={<AddEditDoctor />} />
                    <Route path="/add-edit-doctor/:id" element={<AddEditDoctor />} />
                    <Route path="/doctor-onbording" element={<DoctorOnbordingList />} />
                    <Route
                        path="/recipient-onboarding"
                        element={<RecipientOnboarding />}
                    />

                    <Route
                        path="/add-edit-recipient"
                        element={<AddEditRecipient />}
                    />

                    <Route
                        path="/add-edit-recipient/:id"
                        element={<AddEditRecipient />}
                    />

                    <Route
                        path="/patitent-onboarding"
                        element={<PatitentOnbordingList />}
                    />
                    <Route
                        path="/add-edit-patitent"
                        element={<AddEditPatient />}
                    />
                    <Route
                        path="/add-edit-patitent/:id"
                        element={<AddEditPatient />}
                    />
                    <Route
                        path="/view-patitent/:id"
                        element={<PatientView />}
                    />

                </Route>
            </Route>

            {/* 🔓 Public Routes */}
            <Route element={<Public />}>
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default AppRoutes