import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MarketDataUpdateMessage, TickerMessage} from "../marketdata/models"

export interface MarketDataState {
    tickerMessages?: MarketDataUpdateMessage<TickerMessage>[];
}

const initialState: MarketDataState = {};

const marketdataSlice = createSlice({
    name: "marketdata",
    initialState,
    reducers: {
        setTickerMessages(state, action: PayloadAction<MarketDataUpdateMessage<TickerMessage>[]>) {
            state.tickerMessages = action.payload;
        },
    },
});

export const {setTickerMessages} = marketdataSlice.actions;

export default marketdataSlice.reducer;
