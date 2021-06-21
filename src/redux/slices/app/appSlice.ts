import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const {REACT_APP_STAGE} = process.env;

const initialState = {
    env: REACT_APP_STAGE,
    title: ''
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
        },
    },
});

export const {
    setTitle
} = appSlice.actions;

export default appSlice.reducer;
