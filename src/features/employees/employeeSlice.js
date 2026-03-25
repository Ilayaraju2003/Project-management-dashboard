import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const employeeSlice = createSlice({
  name: "employees",
  initialState: [],
  reducers: {
    addEmployee: (state, action) => {
      state.push({ id: uuid(), ...action.payload });
    },

    deleteEmployee: (state, action) => {
      return state.filter(emp => emp.id !== action.payload);
    },

    // ✅ ADD THIS
    updateEmployee: (state, action) => {
      const index = state.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addEmployee, deleteEmployee, updateEmployee } =
  employeeSlice.actions;

export default employeeSlice.reducer;