import {HubConnectionState} from "@microsoft/signalr";
//import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import {Observable, Subject, timer} from "rxjs";
import {bufferTime, filter, groupBy, last, mergeMap} from "rxjs/operators";
import {HubService} from "../HubService"
import {
    EventType,
    MarketDataMessage,
    MarketDataUpdateMessage,
    SubscriptionRequest,
    TickerMessage,
} from "../../redux/slices/marketdata/models";
import {Currency} from "../instrument/models";

const {REACT_APP_API_URI_MARKETDATA, REACT_APP_STAGE} = process.env;

export class MarketDataService extends HubService {
    private static instance: MarketDataService;
    private readonly _prevTickerMessages: Record<string, TickerMessage>;
    private _instrumentCodes: string[] = [];
    private _onTickerUpdate: Subject<MarketDataUpdateMessage<TickerMessage>>;
    private _currencies: Currency[] = [];

    private _methodNames = {
        RECEIVE_MESSAGE: "ReceiveMessage",
        UNSUBSCRIBE_ALL: "UnsubscribeAll",
        SUBSCRIBE: "Subscribe",
    };

    public get instrumentCodes(): string[] {
        return this._instrumentCodes;
    }

    // keep this as this is singleton class
    private constructor() {
        super();
        this._onTickerUpdate = new Subject<MarketDataUpdateMessage<TickerMessage>>();
        this._prevTickerMessages = {};

        this.tickerUpdate.subscribe(tickers=>{
            tickers.forEach(data => {
                this._prevTickerMessages[data.current.instrumentCode] = data.current;
            });
        })
    }

    public get tickerUpdate(): Observable<MarketDataUpdateMessage<TickerMessage>[]> {
        const refreshTime = 5000;
        return this._onTickerUpdate
            .pipe(
                groupBy(k => k.current.instrumentCode, x => x, () => timer(refreshTime)),
                mergeMap(x => x.pipe(last())),
                bufferTime(refreshTime / 2),
                filter(b => b.length > 0)
            );
    }

    public get endPoint(): string {
        return `${REACT_APP_API_URI_MARKETDATA}/realtimeHub`;
    }

    public static getInstance(): MarketDataService {
        if (!MarketDataService.instance) {
            MarketDataService.instance = new MarketDataService();
        }
        return MarketDataService.instance;
    }

    public setCurrencies(currencies: Currency[]){
        this._currencies = currencies
    }

    public async start(): Promise<HubConnectionState> {
        await this.stop();
        this.hubConnection.onreconnected(async (connectionId?: string) => {
            if (REACT_APP_STAGE === "development")
                console.log("Connection Id", connectionId);
            await this.subscribeTicker(this._currencies.map(c =>c.code));
        });

        this.hubConnection.on(this._methodNames.RECEIVE_MESSAGE, (message) => this.onMessageReceived(message));

        if(this.isDisconnected)
            await this.hubConnection.start();


        if(this.state === 'Connected'){
            await this.subscribeTicker(['BTC']);
        }

        const subscriptionRequest: SubscriptionRequest = {
            event: EventType.Ticker,
            venueCode: "covario",
            instrumentCode: 'BTC',
        };
        await this.hubConnection.invoke(this._methodNames.SUBSCRIBE, subscriptionRequest);
        return this.state;
    }

    protected async beforeStop(): Promise<void> {
        await this.unsubscribe();
    }

    public async unsubscribe(): Promise<void> {
        await this.hubConnection.invoke(this._methodNames.UNSUBSCRIBE_ALL);
    }

    public async subscribeTicker(instrumentCodes: string[] = []): Promise<void> {
        if (!instrumentCodes && this._instrumentCodes)
            instrumentCodes = this._instrumentCodes;

        if (this._instrumentCodes && this._instrumentCodes.length > 0) {
            await this.unsubscribe();
        }

        for (const instrument of instrumentCodes?.filter(i => i.length > 0)) {
            const subscriptionRequest: SubscriptionRequest = {
                event: EventType.Ticker,
                venueCode: "covario",
                instrumentCode: instrument,
            };
            await this.hubConnection.invoke(this._methodNames.SUBSCRIBE, subscriptionRequest);
        }

        this._instrumentCodes = instrumentCodes;
    }

    private onMessageReceived(message: MarketDataMessage): void {
        if (message?.data === null) return;

        let event;

        if (Array.isArray(message.data)) event = message.data[3];
        else event = message.data.event;

        switch (event) {
            case "orderupdate":
                break;
            case "trade":
                break;
            case "ticker":
                this.processTicker(message);
                break;
            default:
                console.warn("Unknown event: ", event);
                break;
        }
    }

    private processTicker(item: MarketDataMessage): void {
        const data: TickerMessage = item.data;
        if (data.volume !== 0) {
            this._onTickerUpdate.next({
                previous: this._prevTickerMessages[data.instrumentCode],
                current: data,
            });
            //this._prevTickerMessages[data.instrumentCode] = data;
        }
    }
}

export default MarketDataService.getInstance();
