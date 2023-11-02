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
    // Add a new action to remove old data except the latest one for each employeeId
    removeOldDataExceptLatest: (state) => {
      const latestData = {};

      state.employees.forEach((employee) => {
        if (!latestData[employee.employeeId] || latestData[employee.employeeId].date < employee.date) {
          latestData[employee.employeeId] = employee;
        }
      });

      state.employees = Object.values(latestData);
    },
  },
});

export const { setEmployeeData, removeOldDataExceptLatest } = employeeSlice.actions;
export default employeeSlice.reducer;
