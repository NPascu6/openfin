import {InstrumentService} from "../../services/instrument/InstrumentService";
import {setCurrencies} from "../slices/instruments/instrument";
import {setOtcInstruments} from "../slices/otc/otc";
import MarketDataService from "../../services/marketdata/MarketDataService";

export const fetchCurrencies = () => async (dispatch: (arg0: any) => void) => {
    const instrumentsService = new InstrumentService();
    const currencies = await instrumentsService.getCurrencies();
    MarketDataService.setCurrencies(currencies)
    dispatch(setCurrencies(currencies));
};

export const fetchOtcInstruments = () => async (dispatch: (arg0: any) => void) => {
    const instrumentsService = new InstrumentService();
    const instruments = await instrumentsService.getOtcSpotInstruments();
    dispatch(setOtcInstruments(instruments));
};