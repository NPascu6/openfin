import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {validateCurrentBalance} from "../../../helpers/validations";
import {Account, Balances} from "../../../services/bookKeeper/models";
import {OtcSpotInstrument} from "../../../services/instrument/models";
import {
    OtcLockQuoteRequest,
    OtcOrderEntry,
    OtcOrderRequest,
    OtcOrderRequestError,
    OtcOrderSide,
    OtcOrderStatusEntry,
    OtcOrderValidation,
    OtcQuoteRequest,
    OtcQuoteUpdate
} from "../../../services/otc/models";
import {Notification} from "../app/appSlice";

export interface OtcState {
    instruments: OtcSpotInstrument[];
    instrument?: OtcSpotInstrument;
    baseCurrency: string;
    quoteCurrency: string;
    quantityCurrency: string;
    quantity?: number;
    orderRequest?: OtcOrderRequest;
    quoteId?: string;
    quoteRequest?: OtcQuoteRequest;
    previousQuoteRequest?: OtcQuoteRequest | null;
    previousQuote?: OtcQuoteUpdate;
    currentQuote?: OtcQuoteUpdate;
    lockedQuote?: OtcQuoteUpdate;
    lockedSide: OtcOrderSide;
    isQuoting: boolean;
    slippage: number;
    orderStatusEntry?: OtcOrderStatusEntry;
    orderValidation: OtcOrderValidation;
    account?: Account,
    accountId?: string;
    isOrderProcessing?: boolean;
    recentOrders?: OtcOrderEntry[];
    otcQuoteRequestError?: OtcOrderRequestError;
    otcNotification?: Notification;
    accounts?: Account[];
    totalBalances?: Balances;
}

const initialState: OtcState = {
    instruments: [],
    baseCurrency: "",
    quoteCurrency: "",
    quantityCurrency: "",
    slippage: 3,
    isQuoting: false,
    lockedSide: OtcOrderSide.None,
    orderValidation: {
        side: OtcOrderSide.None,
        isValid: true,
        message: ""
    },
    otcQuoteRequestError: {
        value: false,
        message: ""
    }
};

const otcSlice = createSlice({
    name: "otc",
    initialState,
    reducers: {
        setOtcInstruments(state, action: PayloadAction<OtcSpotInstrument[]>) {
            state.instruments = action.payload;
        },
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
        setOtcLockedQuote(state, action: PayloadAction<OtcLockQuoteRequest>) {
            if (action.payload.lockedQuote.quoteId === state.quoteId) {
                state.lockedQuote = action.payload.lockedQuote;

                if (action.payload.lockedQuote)
                    state.orderValidation = validateCurrentBalance(action.payload)
            }
        },
        setOtcBaseCurrency(state, action: PayloadAction<string>) {
            if (state.baseCurrency !== action.payload) {
                state.baseCurrency = action.payload;

                if (action.payload && state.instruments && state.quoteCurrency) {
                    state.instrument = state.instruments.find(i => i.code === `${state.baseCurrency}-${state.quoteCurrency}`);
                }
            }
        },
        setOtcQuoteCurrency(state, action: PayloadAction<string>) {
            if (state.quoteCurrency !== action.payload) {
                state.quoteCurrency = action.payload;

                if (action.payload && state.instruments && state.baseCurrency) {
                    state.instrument = state.instruments.find(i => i.code === `${state.baseCurrency}-${state.quoteCurrency}`);
                }
            }
        },
        setOtcQuantityCurrency(state, action: PayloadAction<string>) {
            if (state.quantityCurrency !== action.payload)
                state.quantityCurrency = action.payload;
        },
        setOtcQuantity(state, action: PayloadAction<number>) {
            if (state.quantity !== action.payload)
                state.quantity = action.payload;
        },
        setOtcIsQuoting(state, action: PayloadAction<boolean>) {
            state.isQuoting = action.payload
        },
        setOtcLockedSide(state, action: PayloadAction<OtcOrderSide>) {
            state.lockedSide = action.payload
        },
        setOtcOrderStatus(state, action: PayloadAction<OtcOrderStatusEntry>) {
            state.orderStatusEntry = action.payload;
        },
        setOtcSlippage(state, action: PayloadAction<number>) {
            if (state.slippage !== action.payload)
                state.slippage = action.payload;
        },
        setOtcQuoteId(state, action: PayloadAction<string> ) {
            if (state.quoteId !== action.payload)
                state.quoteId = action.payload;
        },
        setOtcQuoteRequest(state, action: PayloadAction<OtcQuoteRequest | null>) {
            let changes = {};

            if (state.previousQuoteRequest) {
                changes = {...changes, ...{previousQuote: {buy: 0, sell: 0}, currentQuote: {buy: 0, sell: 0}}}
            }

            if (action.payload !== null && state.instruments && action.payload.baseCurrency && action.payload.quoteCurrency) {
                const instrument = state.instruments.find(i => i.code === `${action.payload ? action.payload.baseCurrency : ""}-${action.payload ? action.payload.quoteCurrency : ""}`);
                changes = {...changes, ...{quoteRequest: action.payload, instrument: instrument}}
            }

            return {...state, ...changes}
        },
        setOtcOrderRequest(state, action: PayloadAction<OtcOrderRequest | undefined>) {
            state.orderRequest = action.payload
        },
        setOtcAccount(state, action: PayloadAction<Account | undefined>) {
            if (action.payload) {
                state.account = action.payload;
                if (state.accountId !== action.payload.id) {
                    state.accountId = action.payload.id;
                }
            }
        },
        setOtcAccounts(state, action: PayloadAction<Account[] | undefined>) {
            state.accounts = action.payload;
        },
        setOtcPreviousQuoteRequest(state, action: PayloadAction<OtcQuoteRequest | undefined>) {
            state.previousQuoteRequest = action.payload
        },
        setOtcIsOrderProcessing(state, action: PayloadAction<boolean>) {
            state.isOrderProcessing = action.payload
        },
        setOtcRecentOrders(state, action: PayloadAction<OtcOrderEntry[]>) {
            state.recentOrders = action.payload;
        },
        setOtcQuoteRequestError(state, action: PayloadAction<OtcOrderRequestError>) {
            if(state.otcQuoteRequestError){
                if (state.otcQuoteRequestError.value !== action.payload.value
                    && state.otcQuoteRequestError.message !== action.payload.message) {
                    state.otcQuoteRequestError = action.payload
                }
            }

        },
        setOtcNotification(state, action: PayloadAction<Notification>) {
            state.otcNotification = action.payload;
        },
        setTotalBalances(state, action: PayloadAction<Balances>){
            state.totalBalances = action.payload
        }
    },
});

export const {
    setOtcInstruments,
    setOtcCurrentQuote,
    setOtcIsQuoting,
    setOtcLockedSide,
    setOtcLockedQuote,
    setOtcBaseCurrency,
    setOtcQuoteCurrency,
    setOtcQuantityCurrency,
    setOtcQuantity,
    setOtcOrderStatus,
    setOtcSlippage,
    setOtcQuoteId,
    setOtcQuoteRequest,
    setOtcOrderRequest,
    setOtcAccount,
    setOtcAccounts,
    setOtcPreviousQuoteRequest,
    setOtcIsOrderProcessing,
    setOtcRecentOrders,
    setOtcQuoteRequestError,
    setOtcNotification,
    setTotalBalances
} = otcSlice.actions;

export default otcSlice.reducer;
