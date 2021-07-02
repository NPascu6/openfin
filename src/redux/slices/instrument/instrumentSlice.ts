import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Currency, SpotInstrument} from "../../../services/instrument/models";

export interface InstrumentsState {
    currencies?: Currency[];
    instruments?: any[]
    selectedInstruments?: any[]
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
        setSelectedInstruments(state, action: PayloadAction<any>) {
            state.selectedInstruments = action.payload;
        },
    },
});

export const {setCurrencies, setInstruments, setSelectedInstruments} = instrumentSlice.actions;

export default instrumentSlice.reducer;
