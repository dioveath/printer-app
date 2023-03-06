import { createSlice } from "@reduxjs/toolkit";

const generateInitialState = () => {
    return {
        isEnabled: false,
        isPending: false,
        error: null,        
    };
};

const bluetoothSlice = createSlice({
    name: "bluetooth",
    initialState: generateInitialState(),
    reducers: {
        setBTStatus: (state, action) => {            
            state.isEnabled = action.payload.isEnabled;
            state.isPending = false;
            state.error = null;
        },
        setBTPending: (state, _action) => {
            state.isPending = true;
            state.error = null;
        },
        setBTError: (state, action) => {
            state.isEnabled = false;
            state.isPending = false;
            state.error = action.payload.error;
        },
    },
});

export const { setBTStatus, setBTPending, setBTError } = bluetoothSlice.actions;
export default bluetoothSlice.reducer;