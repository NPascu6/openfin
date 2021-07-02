import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {RootState} from "../../redux/slices/rootSlice";
import {MarketDataService} from "../../services/marketdata/MarketDataService";
import {fetchOtcInstruments} from "../../redux/thunks/instrument";
import Marquee from "react-fast-marquee";
import {Divider} from "@material-ui/core";
import MarketTicker from "./MarketTicker";

function StockTicker() {
    const dispatch = useDispatch()
    const [connected, setConnected] = useState(false)
    const [response, setResponse] = useState<any>()
    const {user} = useSelector((state: RootState) => state.app);
    const {instruments, selectedInstruments} = useSelector((state: RootState) => state.instrument);

    useEffect(() => {
        const startMarketData = async () => {
            if (user && !connected) {
                setConnected(true)
                const service = new MarketDataService()
                await service.registerUser(user)
                await service.start(setResponse)
                service.subscribeTicker(instruments?.filter(c => c.quoteCurrencyCode === 'USD').map(c => c.code))
            }
        }

        if (!connected && user && instruments) {
            startMarketData()
        }
    }, [connected, user, instruments])


    useEffect(() => {
        if (!instruments)
            dispatch(fetchOtcInstruments());
    }, [dispatch, instruments])


    return (
        <>
            <Marquee gradient={false} style={{display: 'flex', maxHeight: '2em', overflow: 'hidden'}}>
                {
                    response && instruments && instruments.filter(c => c.quoteCurrencyCode === 'USD').map(i => i.code).map((i, index) => (
                        <MarketTicker
                            instruments={selectedInstruments ?? []}
                            key={index}
                            message={{
                                currency: i,
                                price: response.data.instrumentCode === i ? response.data.last : 0
                            }}/>
                    ))
                }
            </Marquee>
            <Divider flexItem style={{width: '100%', height: '0.07em'}}/>
        </>
    );
}

export default StockTicker;