import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    Firm,
    Fund,
    FundsTransferEntry,
    FundSummary,
    FundSummaryRow,
    JournalEntry,
    TradeEntry
} from "../../../services/bookKeeper/models";

export interface BookkeeperState {
    firm?: Firm;
    activeFund?: Fund;
    activeFundId?: string;
    activeFundSummary?: FundSummary;
    activeSummaryRows?: FundSummaryRow[];
    journalEntries?: JournalEntry[];
    tradeEntries?: TradeEntry[];
    fundsTransferEntries?: FundsTransferEntry[];
}

const initialState: BookkeeperState = {};

const bookkeeperSlice = createSlice({
    name: "bookkeeper",
    initialState: initialState,
    reducers: {
        setFirm(state, action: PayloadAction<Firm>) {
            state.firm = action.payload;
        },
        setActiveFund(state, action: PayloadAction<Fund>) {
            if (state.activeFund?.id !== action.payload.id) {
                state.activeFund = action.payload;
            }
            state.activeFundId = action.payload?.id;
        },
        setActiveFundSummary(state, action: PayloadAction<FundSummary>) {
            state.activeFundSummary = action.payload;
        },
        setActiveSummaryRows(state, action: PayloadAction<FundSummaryRow[]>) {
            state.activeSummaryRows = action.payload;
        },
        setJournalEntries(state, action: PayloadAction<JournalEntry[]>) {
            state.journalEntries = action.payload;
        },
        setTradeEntries(state, action: PayloadAction<TradeEntry[]>) {
            state.tradeEntries = action.payload;
        },
        setFundsTransferEntries(state, action: PayloadAction<FundsTransferEntry[]>) {
            state.fundsTransferEntries = action.payload;
        },
    },
});

export const {
    setFirm,
    setActiveFund,
    setActiveFundSummary,
    setActiveSummaryRows,
    setJournalEntries,
    setTradeEntries,
    setFundsTransferEntries,
} = bookkeeperSlice.actions;

export default bookkeeperSlice.reducer;
