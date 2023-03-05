import { createSlice } from "@reduxjs/toolkit";

const generateInitialState = () => {
    return {
        appName: null,
        domain: null,
    };
};

const setupSlice = createSlice({
    name: "setup",
    initialState: generateInitialState(),
    reducers: {
        initDomain: (state, action) => {
            state.appName = action.payload.appName;
            state.domain = action.payload.domain;
        },
        clear: (state, _action) => {
            state.appName = null;
            state.domain = null;
        },
    }
});

export const { initDomain, clear } = setupSlice.actions;
export default setupSlice.reducer;