import {InstrumentService} from "../src/services/instrument/InstrumentService";
import {setCurrencies, setInstruments} from "./instruments/instrument";

export const fetchCurrencies = () => async (dispatch: (arg0: any) => void) => {
    const instrumentsService = new InstrumentService();
    const currencies = await instrumentsService.getCurrencies();
    dispatch(setCurrencies(currencies));
};

export const fetchInstruments = () => async (dispatch: (arg0: any) => void) => {
    const instrumentsService = new InstrumentService();
    const instruments = await instrumentsService.getSpotInstruments('Covario');
    dispatch(setInstruments(instruments));
};