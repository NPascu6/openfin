import {AuthService} from "../auth/AuthService";
import {RestService} from "../RestService";
import {Currency, OtcSpotInstrument, SpotInstrument} from "./models";

const {REACT_APP_API_URI_INSTRUMENTS} = process.env;

export class InstrumentService extends RestService {
    private _baseUrl = REACT_APP_API_URI_INSTRUMENTS;

    get baseUrl(): string {
        return this._baseUrl??"";
    }

    get authService(): AuthService {
        return AuthService.getInstance();
    }

    public async getCurrencies(): Promise<Currency[]> {
        const response = await this.fetchData("currencies");
        return response.data;
    }

    public async getSpotInstruments(venueCode: string): Promise<SpotInstrument[]> {
        const response = await this.fetchData("spot", {venueCode: venueCode});
        return response.data;
    }

    public async getOtcSpotInstruments(): Promise<OtcSpotInstrument[]> {
        const response = await this.fetchData("spot/otc");
        return response.data;
    }
}

