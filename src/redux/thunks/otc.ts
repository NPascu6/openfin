import {isAnyValueEmpty} from "../../helpers/app";
import {OtcOrderEntry, OtcOrderRequest, OtcQuoteRequest} from "../../services/otc/models";
import OtcService from "../../services/otc/OtcService";
import {
    setOtcBaseCurrency,
    setOtcCurrentQuote,
    setOtcIsOrderProcessing,
    setOtcIsQuoting,
    setOtcOrderRequest,
    setOtcPreviousQuoteRequest,
    setOtcQuoteCurrency,
    setOtcQuoteId,
    setOtcQuoteRequest,
    setOtcRecentOrders
} from "../slices/otc/otc"

export const submitOtcOrders = (orderRequest: OtcOrderRequest) => async (dispatch: (arg0: any) => void) => {
    if (orderRequest) {
        dispatch(setOtcIsOrderProcessing(true))
        dispatch(setOtcOrderRequest(orderRequest));
        await OtcService.submitOrder(orderRequest)
    }
};

export const requestOtcQuote = (quoteRequest: OtcQuoteRequest) => async (dispatch: (arg0: any) => void, getState: () => { (): any; new(): any; otc: { (): any; new(): any; previousQuoteRequest: OtcQuoteRequest; }; }) => {
    const previousQuoteRequest: OtcQuoteRequest = getState().otc.previousQuoteRequest;
    if (!quoteRequest) {
        quoteRequest = previousQuoteRequest;
    }

    if (quoteRequest) {
        if (previousQuoteRequest) {
            dispatch(setOtcCurrentQuote({buy: 0, sell: 0}));
        }

        if (!isAnyValueEmpty(quoteRequest.baseCurrency, quoteRequest.quoteCurrency, quoteRequest.quantityCurrency)
            && quoteRequest.quantity && quoteRequest.quantity > 0) {
            dispatch(setOtcQuoteRequest(quoteRequest));
            const quoteId = await OtcService.requestQuote(quoteRequest);
            if (quoteId)
                dispatch(setOtcQuoteId(quoteId));
        }
    }
};

export const stopOtcQuote = () => async (dispatch: (arg0: { payload: string | boolean | OtcQuoteRequest; type: string; }) => void) => {
    await OtcService.stop();
    dispatch(setOtcIsQuoting(false));
    // @ts-ignore
    dispatch(setOtcQuoteRequest(null));
    // @ts-ignore
    dispatch(setOtcPreviousQuoteRequest(undefined));
    dispatch(setOtcBaseCurrency(""));
    dispatch(setOtcQuoteCurrency(""));
    dispatch(setOtcQuoteId(""));
};

export const pauseOtcQuote = () => async (dispatch: (arg0: { payload: boolean; type: string; }) => void) => {
    dispatch(setOtcIsQuoting(false));
};

export const fetchRecentOtcOrders = (accountId: string) => async (dispatch: (arg0: { payload: OtcOrderEntry[]; type: string; }) => void) => {
    const orders = await OtcService.requestRecentOtcTradeOrders(accountId)
    if (orders)
        dispatch(setOtcRecentOrders(orders))
}
