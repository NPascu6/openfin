import {Account, Balances} from "../bookKeeper/models";
import {SpotInstrument} from "../instrument/models";

export interface OtcQuoteUpdate {
    quoteId?: string;
    baseCurrency?: string;
    quoteCurrency?: string;
    quantity?: number;
    orderCurrency?: string;
    buy: number;
    sell: number;
}

export interface OtcOrderStatusEntry {
    quoteId: string;
    orderId: string;
    side: OtcOrderSide;
    instrumentCode: string;
    executedQuantity: number;
    executionPrice: number;
    clientPrice: number; // to be replaced by price
    price?: number;
    totalPrice: number; // to be replaced by totalAmount
    totalAmount?: number;
    fees?: number;
    status: OtcExecutionStatus;
    timestamp: Date;
};

export interface OtcOrderEntry {
    quoteId: string;
    orderId: string;
    side: OtcOrderSide;
    instrumentCode: string;
    baseCurrency: string;
    quoteCurrency: string;
    quantity: number;
    quantityCurrency: string;
    executedQuantity: number | string;
    executionPrice: number | string;
    price: number | string;
    status: OtcExecutionStatus;
    timestamp: Date;
};

export interface OtcOrderRequest {
    quoteId: string;
    accountId?: string;
    fundId?: string;
    quantity: number;
    side: OtcOrderSide;
    displayedPrice: number;
    maxSlippage: number;
};

export interface OtcQuoteRequest {
    accountId?: string;
    fundId?: string;
    baseCurrency: string;
    quoteCurrency: string;
    quantity: number;
    quantityCurrency: string;
    maxSlippage: number;
};

export enum OtcEventType {
    Information = "Information",
    Error = "Error"
};

export enum OtcEventDescription {
    PriceFeedStopped = "PriceFeedStopped",
    CannotGetQuote = "CannotGetQuote",
    AboveLimit = "AboveLimit"
};

export interface OtcQuoteEvent {
    quoteId: string;
    type: OtcEventType;
    description: OtcEventDescription;
};

export interface OtcLockQuoteRequest {
    lockedQuote: OtcQuoteUpdate;
    account: Account;
    totalBalances: Balances,
    instrument: SpotInstrument;
    side: OtcOrderSide;
};

export enum OtcExecutionStatus {
    Pending = "Pending", // first step
    Sequestered = "Sequestered", // next step
    Filled = "Filled", // next step
    Rejected = "Rejected",  // completed
    BookingError = "BookingError",  // completed
    BookingSuccess = "BookingSuccess",  // completed
    TimedOut = "TimedOut" // completed
};

export enum OtcOrderSide {
    None,
    Buy = "Buy",
    Sell = "Sell"
};

export interface OtcOrderValidation {
    side: OtcOrderSide;
    isValid: boolean;
    message: string;
};

export interface OtcOrderRequestError {
    value: boolean;
    message?: string;
}