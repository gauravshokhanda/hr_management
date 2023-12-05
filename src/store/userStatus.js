// employeeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
  },
  reducers: {
    setEmployeeData: (state, action) => {
      state.employees = action.payload;
    },
    clearEmployeeData: (state) => {
      state.employees = [];
    },
  },
});

export const { setEmployeeData, clearEmployeeData } = employeeSlice.actions;
export default employeeSlice.reducer;
