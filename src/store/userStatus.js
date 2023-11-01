// employeeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: null,
  },
  reducers: {
    setEmployeeData: (state, action) => {
      state.employees = action.payload;
    },
    clearEmployeeData: (state) => {
      state.employees = null;
    },
  },
});

export const { setEmployeeData } = employeeSlice.actions;
export default employeeSlice.reducer;
