import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import patientService from "../services/patientService";

/* =======================================================
   📌 GET ALL PATIENTS
======================================================= */
export const fetchPatients = createAsyncThunk(
  "patient/fetchPatients",
  async (
    { page = 1, limit = 10, orderBy = "createdAt", order = "DESC", search = "" },
    { rejectWithValue }
  ) => {
    try {
      const res = await patientService.getPatients({ page, limit, orderBy, order, search });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =======================================================
   📌 GET SINGLE PATIENT
======================================================= */
export const fetchPatientById = createAsyncThunk(
  "patient/fetchPatientById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await patientService.getPatientById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =======================================================
   🟢 CREATE PATIENT  (VALIDATION SAFE)
======================================================= */
export const createPatient = createAsyncThunk(
  "patient/createPatient",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await patientService.createPatient(payload);

      // 🔥 If backend returns success = false → treat as error
      if (res?.success === false) {
        return rejectWithValue(res);
      }

      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =======================================================
   🟡 UPDATE PATIENT  (VALIDATION SAFE)
======================================================= */
export const updatePatient = createAsyncThunk(
  "patient/updatePatient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await patientService.updatePatient(id, data);

      if (res?.success === false) {
        return rejectWithValue(res);
      }

      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =======================================================
   🔴 DELETE PATIENT
======================================================= */
export const deletePatient = createAsyncThunk(
  "patient/deletePatient",
  async (id, { rejectWithValue }) => {
    try {
      const res = await patientService.deletePatient(id);

      if (res?.success === false) {
        return rejectWithValue(res);
      }

      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =======================================================
   INITIAL STATE
======================================================= */
const initialState = {
  patients: [],
  patient: null,

  total: 0,
  totalPages: 1,
  page: 1,
  limit: 10,

  orderBy: "createdAt",
  order: "DESC",
  search: "",

  loading: false,
  error: null,
  success: false,
};

/* =======================================================
   SLICE
======================================================= */
const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    resetPatientState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      /* ================= FETCH ALL ================= */
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.patients || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.page = action.meta.arg.page;
        state.limit = action.meta.arg.limit;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH BY ID ================= */
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload.patient;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newPatient =
          action.payload.data || action.payload.patient || action.payload;

        if (newPatient) state.patients.unshift(newPatient);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated =
          action.payload.data || action.payload.patient || action.payload;

        const index = state.patients.findIndex((p) => p._id === updated?._id);
        if (index !== -1) state.patients[index] = updated;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.patients = state.patients.filter(
          (item) => item._id !== action.meta.arg
        );
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetPatientState } = patientSlice.actions;
export default patientSlice.reducer;
