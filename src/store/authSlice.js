// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    setUserAndToken: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUserAndToken: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUserAndToken, clearUserAndToken } = authSlice.actions;
export default authSlice.reducer;
