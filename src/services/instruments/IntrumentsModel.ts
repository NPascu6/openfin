export interface Currency {
    code: string;
    name: string;
    description: string;
    type: string;
    active: boolean;
}

export interface Instrument {
    code: string;
    name: string;
    baseCurrencyCode: string;
    quoteCurrencyCode: string;
    venueCode: string;
    venueInstrumentCode: string;
    active: boolean;
    tickSize: number;
    minimumSize: number;
    sizeIncrement: number;
}

export interface SpotInstrument extends Instrument {

}

export interface Derivative extends Instrument {
    underlyingCode: string;
    contractCurrencyCode: string;
    settlementCurrencyCode: string;
    listedDate: string;
    settlementDate: string;
    contractSize: number;
}

export interface SwapInstrument extends Derivative {
}

export interface OptionInstrument extends Derivative {
    strike: string;
    optionStyle: string;
    optionType: string;
    optionState: number;
    lotSize: number;
    startDate: string;
    maturityDate: string;
}

export interface FutureInstrument extends Derivative {
    maturityDate: string;
    isInverse: boolean,
}

export interface Venue {
    code: string;
    name: string;
    type: string;
    active: boolean;
    instrumentTypes: InstrumentType[]
}

export enum InstrumentType {
    Spot = "spot",
    Futures = "futures",
    Swaps = "swaps",
    Options = "options",
}