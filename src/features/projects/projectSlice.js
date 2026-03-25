import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const projectSlice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    addProject: (state, action) => {
      state.push({ id: uuid(), ...action.payload });
    },

    deleteProject: (state, action) => {
      return state.filter(p => p.id !== action.payload);
    },

    // ✅ ADD THIS
    updateProject: (state, action) => {
      const index = state.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addProject, deleteProject, updateProject } =
  projectSlice.actions;

export default projectSlice.reducer;