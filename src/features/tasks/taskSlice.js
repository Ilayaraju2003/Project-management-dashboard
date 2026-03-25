import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push({
        id: uuid(),
        status: "todo",
        ...action.payload,
      });
    },

    deleteTask: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },

    updateTask: (state, action) => {
      const index = state.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },

    // ✅ ADD THIS FOR DASHBOARD
    updateTaskStatus: (state, action) => {
      const task = state.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
  },
});

export const {
  addTask,
  deleteTask,
  updateTask,
  updateTaskStatus, // ✅ export this
} = taskSlice.actions;

export default taskSlice.reducer;