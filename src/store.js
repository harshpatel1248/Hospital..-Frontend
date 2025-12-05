import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorSlice";
import recipientReducer from "./slices/recipientSlice";
import patientReducer from "./slices/patientSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        doctor: doctorReducer,
        recipient: recipientReducer,
        patient: patientReducer,
    },

});

export default store;
