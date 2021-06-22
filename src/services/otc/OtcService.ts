import {HubConnectionState} from "@microsoft/signalr";
import {Observable, Subject} from "rxjs";
import {HubService} from "../HubService";
import {
    OtcOrderEntry,
    OtcOrderRequest,
    OtcOrderStatusEntry,
    OtcQuoteEvent,
    OtcQuoteRequest,
    OtcQuoteUpdate
} from "./OtcModel";

const {REACT_APP_API_URI_OTC} = process.env;

export class OtcService extends HubService {
    private static instance: OtcService;
    private _lastQuoteRequest: OtcQuoteRequest | null = null;
    private recentOtcTrades: OtcOrderEntry[] | null = null;
    private readonly _quoteUpdateSubject: Subject<OtcQuoteUpdate>;
    private readonly _orderStatusSubject: Subject<OtcOrderStatusEntry>;
    private readonly _quoteEventSubject: Subject<OtcQuoteEvent>;
    private _accountId: string  = '';
    private _fundId: string = '';
    private _currentOtcQuoteId: string = '';

    private _methodNames = {
        SET_RFQ: "SetRfq",
        PRICE_UPDATE: "PriceUpdate",
        ORDER_STATUS: "OrderStatus",
        QUOTE_EVENT: "QuoteEvent",
        SNAPSHOT: "Snapshot",
        TRADE: "Trade",
        RECENT_ORDERS: "RecentOrders"
    };

    private constructor() {
        super();
        this._quoteUpdateSubject = new Subject<OtcQuoteUpdate>();
        this._orderStatusSubject = new Subject<OtcOrderStatusEntry>();
        this._quoteEventSubject = new Subject<OtcQuoteEvent>();
    }

    public get endPoint(): string {
        return `${REACT_APP_API_URI_OTC}/otcTrading`;
    }

    public get quoteUpdate(): Observable<OtcQuoteUpdate> {
        return this._quoteUpdateSubject;
    }

    public get orderStatusUpdate(): Observable<OtcOrderStatusEntry> {
        return this._orderStatusSubject;
    }

    public get quoteEventUpdate(): Observable<OtcQuoteEvent> {
        return this._quoteEventSubject;
    }

    public static getInstance(): OtcService {
        if (!OtcService.instance) {
            OtcService.instance = new OtcService();
        }
        return OtcService.instance;
    }

    public getCurrentQuoteId = () => {
        return this._currentOtcQuoteId
    }

    public async start(): Promise<HubConnectionState> {
        try {
            if (this.isDisconnected) {
                this.hubConnection.on(this._methodNames.PRICE_UPDATE, (quoteUpdate: OtcQuoteUpdate) => this.onQuoteUpdate(quoteUpdate));
                this.hubConnection.on(this._methodNames.ORDER_STATUS, (otcOrderEntry: OtcOrderStatusEntry) => this.onOrderStatusUpdate(otcOrderEntry));
                this.hubConnection.on(this._methodNames.QUOTE_EVENT, (quoteEvent: OtcQuoteEvent) => this.onQuoteEventUpdate(quoteEvent));

                this.hubConnection.onreconnected(connectionId => {
                    if (this.isDevelopment)
                        console.log("Reconnected", connectionId);

                    if (this._lastQuoteRequest !== null && this._accountId !== '') {
                        this.requestQuote(this._lastQuoteRequest)
                        this.requestRecentOtcTradeOrders(this._accountId)
                    }
                });

                await this.hubConnection.start();
            }

            return this.state;
        } catch (error) {
            console.log(error);
        }

        return HubConnectionState.Disconnected;
    }

    public async submitOrder(orderRequest: OtcOrderRequest): Promise<boolean> {
        if (this.isDevelopment)
            console.log("Submit Order", orderRequest);

        await this.hubConnection.invoke(this._methodNames.TRADE, orderRequest);
        return true;
    }

    public async requestQuote(quoteRequest: OtcQuoteRequest): Promise<string> {
        if (this.isDisconnected) {
            await this.start();
        }

        this._currentOtcQuoteId = '';
        this._lastQuoteRequest = quoteRequest;

        if (this.isConnected && quoteRequest) {
            if (this.isDevelopment)
                console.log("Request quote", quoteRequest);
            return this._currentOtcQuoteId = await this.hubConnection.invoke(this._methodNames.SET_RFQ, quoteRequest);
        } else {
            return '';
        }
    }

    public async requestQuoteSnapshot(quoteId: string): Promise<string | undefined> {
        if (this.isDisconnected) {
            await this.start();
        }

        if (this.isConnected && quoteId) {
            if (this.isDevelopment)
                console.log("Request otc snapshot.", quoteId);

            return await this.hubConnection.invoke(this._methodNames.SNAPSHOT, quoteId).then((response) => {
                return response
            }).catch(err => {
                console.log(err.message)
            })
        } else {
            await this.start();
        }
    }

    public async requestRecentOtcTradeOrders(accountId: string): Promise<OtcOrderEntry[] | undefined> {
        if (this.isDisconnected) {
            await this.start();
        }

        if (this.isConnected && accountId) {
            if (this.isDevelopment)
                console.log("Request recent otc trade orders", accountId);

            this._accountId = accountId

            return await this.hubConnection.invoke(this._methodNames.RECENT_ORDERS, accountId).then((response) => {
                return this.recentOtcTrades = response
            }).catch(err => {
                console.log(err.message)
            })
        } else {
            await this.start();
        }
    }

    protected beforeStop(): Promise<void> {
        return Promise.resolve(undefined);
    }

    private async onQuoteUpdate(quoteUpdate: OtcQuoteUpdate): Promise<void> {
        if (this._currentOtcQuoteId === quoteUpdate.quoteId) {
            this._quoteUpdateSubject.next(quoteUpdate)
        }
    }

    private async onOrderStatusUpdate(otcOrderEntry: OtcOrderStatusEntry): Promise<void> {
        this._orderStatusSubject.next(otcOrderEntry)
    }

    private async onQuoteEventUpdate(orderEvent: OtcQuoteEvent): Promise<void> {
        this._quoteEventSubject.next(orderEvent);
    }
}

export default OtcService.getInstance();