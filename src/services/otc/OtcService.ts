import {HubConnectionState} from "@microsoft/signalr";
import {Observable, Subject} from "rxjs";
import {HubService} from "../HubService";
import {OtcOrderEntry, OtcOrderRequest, OtcOrderStatusEntry, OtcQuoteEvent, OtcQuoteRequest} from "./OtcModel";

const {REACT_APP_API_URI_OTC} = process.env;

export class OtcService extends HubService {
    private static instance: OtcService;
    private _lastQuoteRequest: OtcQuoteRequest | undefined;
    private recentOtcTrades: OtcOrderEntry[] | undefined;
    private readonly _quoteUpdateSubject: Subject<any>;
    private readonly _orderStatusSubject: Subject<OtcOrderStatusEntry>;
    private readonly _quoteEventSubject: Subject<OtcQuoteEvent>;
    private currentOtcQuoteId: null;

    private _methodNames = {
        SET_ADMIN_RFQ: "SetRfq",
        ADMIN_PRICE_UPDATE: "PriceUpdate",
        ORDER_STATUS: "OrderStatus",
        QUOTE_EVENT: "QuoteEvent",
        TRADE: "Trade",
        RECENT_ORDERS: "RecentOrders"
    };

    private constructor() {
        super();
        this._quoteUpdateSubject = new Subject<any>();
        this._orderStatusSubject = new Subject<OtcOrderStatusEntry>();
        this._quoteEventSubject = new Subject<OtcQuoteEvent>();
    }

    public get endPoint(): string {
        return `${REACT_APP_API_URI_OTC}/otcTrading`;
    }

    public get quoteUpdate(): Observable<any> {
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
        return this.currentOtcQuoteId
    }

    public async start(): Promise<HubConnectionState> {
        try {
            if (this.isDisconnected) {

                this.hubConnection.on(this._methodNames.ADMIN_PRICE_UPDATE, (quoteUpdate: any) => this.onQuoteUpdate(quoteUpdate));
                this.hubConnection.on(this._methodNames.ORDER_STATUS, (otcOrderEntry: OtcOrderStatusEntry) => this.onOrderStatusUpdate(otcOrderEntry));
                this.hubConnection.on(this._methodNames.QUOTE_EVENT, (quoteEvent: OtcQuoteEvent) => this.onQuoteEventUpdate(quoteEvent));

                this.hubConnection.onreconnected(connectionId => {
                    if (this.isDevelopment)
                        console.log("Reconnected", connectionId);
                    if (this.currentOtcQuoteId === null) {
                        this.requestQuote(this._lastQuoteRequest)
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

    public async requestQuote(quoteRequest: OtcQuoteRequest | undefined): Promise<null> {
        if (this.isDisconnected) {
            await this.start();
        }

        this.currentOtcQuoteId = null;
        this._lastQuoteRequest = quoteRequest;

        if (this.isConnected && quoteRequest) {
            if (this.isDevelopment)
                console.log("Request quote", quoteRequest);
            return this.currentOtcQuoteId = await this.hubConnection.invoke(this._methodNames.SET_ADMIN_RFQ, quoteRequest);
        } else {
            return null;
        }
    }

    public async requestRecentOtcTradeOrders(accountId: string): Promise<any[] | undefined> {
        if (this.isDisconnected) {
            await this.start();
        }

        if (this.isConnected && accountId) {
            if (this.isDevelopment)
                console.log("Request recent otc trade orders", accountId);

            return await this.hubConnection.invoke(this._methodNames.RECENT_ORDERS, accountId).then((response) => {
                return this.recentOtcTrades = response
            }).catch(err => {
                console.log(err.message)
                return err.data.message
            })
        } else {
            await this.start();
        }
    }

    protected beforeStop(): Promise<void> {
        return Promise.resolve(undefined);
    }

    private async onQuoteUpdate(quoteUpdate: any): Promise<void> {
        this._quoteUpdateSubject.next(quoteUpdate)
    }

    private async onOrderStatusUpdate(otcOrderEntry: OtcOrderStatusEntry): Promise<void> {
        this._orderStatusSubject.next(otcOrderEntry)
    }

    private async onQuoteEventUpdate(orderEvent: OtcQuoteEvent): Promise<void> {
        this._quoteEventSubject.next(orderEvent);
    }
}

export default OtcService.getInstance();