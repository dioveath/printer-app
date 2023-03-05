import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import setupReducer from "./setup/setupSlice";
import { apiSlice } from "./apiSlice";
import { domainApiSlice } from "./domainApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    setup: setupReducer,
    api: apiSlice.reducer,
    domainApi: domainApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(domainApiSlice.middleware),
});
