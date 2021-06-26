export interface Currency {
    code: string;
    name: string;
    description: string;
    type: string;
    active: boolean;
}

export interface SpotInstrument {
    code: string;
    name: string;
    baseCurrencyCode: string;
    quoteCurrencyCode: string;
    venueCode?: string;
    active: boolean;
    tickSize: number | string;
    minimumSize: number | string;
    sizeIncrement: number | string;
}

export interface OtcSpotInstrument extends SpotInstrument {
    venueCodes: string[];
}