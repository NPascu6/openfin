import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Account} from "../../../services/bookkeeper/BookkeeperModel";
import {OtcOrderStatusEntry, OtcQuoteRequest, OtcQuoteUpdate} from "../../../services/otc/OtcModel";

export interface OtcState {
    account?: Account,
    baseCurrency?: string;
    quoteCurrency?: string;
    currentQuote?: OtcQuoteUpdate;
    isQuoting?: boolean;
    quoteRequest?: OtcQuoteRequest;
    orderStatusEntry?: OtcOrderStatusEntry;
    accounts?: Account[];
}

const initialState: OtcState = {
    baseCurrency: "",
    quoteCurrency: "",
    isQuoting: false,
};

const otcSlice = createSlice({
    name: "otc",
    initialState,
    reducers: {
        setOtcCurrentQuote(state, action: PayloadAction<OtcQuoteUpdate>) {
            const quoteUpdate = action.payload;
            if ((quoteUpdate.baseCurrency === state.baseCurrency && quoteUpdate.quoteCurrency === state.quoteCurrency)
                || quoteUpdate.baseCurrency === undefined) {
                let changes = {previousQuote: state.currentQuote ?? quoteUpdate, currentQuote: quoteUpdate};

                if (!state.isQuoting && quoteUpdate.buy !== 0 && quoteUpdate.sell !== 0) {
                    changes = {
                        ...changes, ...{
                            isQuoting: true,
                            previousQuoteRequest: state.quoteRequest,
                            otcQuoteRequestError: {message: "", value: false}
                        }
                    };
                }

                return {...state, ...changes};
            }
        },
        setOtcOrderStatus(state, action: PayloadAction<OtcOrderStatusEntry>) {
            state.orderStatusEntry = action.payload;
        },
        setOtcAccount(state, action: PayloadAction<Account>) {
            if (action.payload) {
                state.account = action.payload;
            }
        },
        setOtcAccounts(state, action: PayloadAction<Account[]>) {
            state.accounts = action.payload;
        },
    },
});

export const {
    setOtcAccount,
    setOtcAccounts,
    setOtcCurrentQuote,
    setOtcOrderStatus
} = otcSlice.actions;

export default otcSlice.reducer;
