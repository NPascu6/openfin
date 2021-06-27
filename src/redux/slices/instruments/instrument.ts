import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Currency, SpotInstrument} from "../../../services/instrument/models";

export interface InstrumentsState {
    currencies?: Currency[];
    instruments?: SpotInstrument[];
}

const initialState: InstrumentsState = {};

const instrumentSlice = createSlice({
    name: "instrument",
    initialState,
    reducers: {
        setCurrencies(state, action: PayloadAction<Currency[]>) {
            state.currencies = action.payload;
        },
        setInstruments(state, action: PayloadAction<SpotInstrument[]>) {
            state.instruments = action.payload;
        },
    },
});

export const {setCurrencies, setInstruments} = instrumentSlice.actions;

export default instrumentSlice.reducer;
