import {InstrumentService} from "../../services/instrument/InstrumentService";
import {setCurrencies, setInstruments} from "../slices/instrument/instrumentSlice";

export const fetchCurrencies = () => async (dispatch: any) => {
    const instrumentsService = new InstrumentService();
    const currencies = await instrumentsService.getCurrencies();
    dispatch(setCurrencies(currencies));
};

export const fetchOtcInstruments = () => async (dispatch: any) => {
    const instrumentsService = new InstrumentService();
    const instruments = await instrumentsService.getOtcSpotInstruments();
    dispatch(setInstruments(instruments));
};