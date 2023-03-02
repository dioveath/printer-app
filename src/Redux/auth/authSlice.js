import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../Helpers/jwt";

const generateInitialState = () => {
  //   var accessToken = localStorage.getItem("accessToken") ?? null;
  //   var userId = localStorage.getItem("userId") ?? null;
  let accessToken, userId;
  return {
    userId,
    accessToken,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: generateInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      //   localStorage.setItem("accessToken", action.payload.accessToken);
      //   localStorage.setItem("userId", action.payload.userId);
    },
    updateToken: (state, _action) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        state.accessToken = null;
        state.userId = null;
        return;
      }

      if (isTokenExpired(token)) {
        state.accessToken = null;
        state.userId = null;
      }
    },

    logout: (state, _action) => {
      //   localStorage.removeItem("accessToken");
      //   localStorage.removeItem("userId");
      state.accessToken = null;
      state.userId = null;
    },
  },
});

export const { setCredentials, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;
