import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import authReducer from "./auth/authSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
