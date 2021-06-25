export interface SubscriptionRequest {
    instrumentCode: string;
    venueCode: string;
    event: EventType;
}

export enum EventType {
    Error = "error",
    Heartbeat = "heartbeat",
    Ticker = "ticker",
    Trade = "trade",
    OrderUpdate = "orderupdate",
    OrderBook = "orderbook",
}

export enum SideType {
    Buy = "buy",
    Sell = "sell"
}

export interface IMessage {
    instrumentCode: string;
    venueCode: string;
    event: EventType;
    time: string;
    timeReceived?: string;
    latency?: number | string;
}

export interface TickerMessage extends IMessage {
    bid: number | string;
    ask: number | string;
    last: number | string;
    low24H: number | string;
    high24H: number | string;
    open24H: number | string;
    volume: number | string;
    volume24H: number | string;
}

export interface MarketDataMessage {
    v2c: number | string;
    c2g: number | string;
    data: any;
}

export interface MarketDataUpdateMessage<T> {
    previous: T;
    current: T;
}
