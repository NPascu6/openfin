import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Currency} from "../../../services/instrument/models";

export interface InstrumentsState {
    currencies?: Currency[];
}

const initialState: InstrumentsState = {};

const instrumentSlice = createSlice({
    name: "instrument",
    initialState,
    reducers: {
        setCurrencies(state, action: PayloadAction<Currency[]>) {
            state.currencies = action.payload;
        },
    },
});

export const {setCurrencies} = instrumentSlice.actions;

export default instrumentSlice.reducer;
