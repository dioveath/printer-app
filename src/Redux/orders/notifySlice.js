import { createSlice } from "@reduxjs/toolkit";

const generateInitialState = () => {
    return {
        notifySound: null,
        status: null
    };
};

const notifySlice = createSlice({
    name: "notify",
    initialState: generateInitialState(),
    reducers: {
        initNotifySound: (state, action) => {
            state.notifySound = action.payload.notifySound;
        },
        updateStatus: (state, action) => {
            state.status = action.payload.status;
        },
        clear: (state, _action) => {
            state.notifySound = null;
        },
    }
});

export const { initNotifySound, updateStatus, clear } = notifySlice.actions;
export default notifySlice.reducer;