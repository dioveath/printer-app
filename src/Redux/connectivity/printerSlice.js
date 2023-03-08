import { createSlice } from "@reduxjs/toolkit";

const generateInitialState = () => {
    return {
        device: null,
        status: null,
        isPending: false,
        error: null,        
    };
};

const printerSlice = createSlice({
    name: "printer",
    initialState: generateInitialState(),
    reducers: {
        setPrinter: (state, action) => {
            state.device = action.payload;
            state.isPending = false;
            state.error = null;
        },
        setPrinterStatus: (state, action) => {
            state.status = action.payload;
        },
        setPrinterPending: (state, _action) => {
            state.isPending = true;
            state.error = null;
        },
        setPrinterError: (state, action) => {
            state.isPending = false;
            state.error = action.payload.error;
        }
    }
});

export const { setPrinter, setPrinterStatus, setPrinterPending, setPrinterError } = printerSlice.actions;
export default printerSlice.reducer;