// store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use local storage

import authReducer from "./authSlice"; // Import your auth slice

const rootReducer = combineReducers({
  auth: authReducer, // Add your auth reducer to the root reducer
  // Add other reducers here if you have them
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Add middleware and other configurations here if needed
});

export const persistor = persistStore(store);

export default store;
