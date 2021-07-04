import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {RootState} from "../../redux/slices/rootSlice";
import {MarketDataService} from "../../services/marketdata/MarketDataService";
import {fetchOtcInstruments} from "../../redux/thunks/instrument";
import MarketTicker from "./MarketTicker";
import Marquee from "react-fast-marquee";

function StockTicker() {
    const dispatch = useDispatch()
    const [connected, setConnected] = useState(false)
    const [response, setResponse] = useState<any>()
    const {user} = useSelector((state: RootState) => state.app);
    const {instruments, selectedInstruments} = useSelector((state: RootState) => state.instrument);
    const [service, setService] = useState<any>()

    useEffect(() => {
        const startMarketData = async () => {
            if (user && !connected && !service) {
                setConnected(true)
                const newService = new MarketDataService()
                await newService.registerUser(user)
                await newService.start(setResponse)
                setService(newService)
            }
        }

        if (!connected && user && instruments) {
            startMarketData()
        }
    }, [connected, user, instruments, service])

    useEffect(() => {
        if (service && selectedInstruments) {
            service.unsubscribe()
            service.subscribeTicker(selectedInstruments?.map(c => c.code))
        }

    }, [service, selectedInstruments])

    useEffect(() => {
        if (!instruments && user)
            dispatch(fetchOtcInstruments());
    }, [dispatch, instruments, user])

    return (
        <>
            {response && selectedInstruments &&
            <Marquee gradient={false}>
                {response && selectedInstruments && selectedInstruments
                    .map(i => i.code).map((i, index) => (
                        <MarketTicker
                            key={index}
                            message={{
                                currency: i,
                                price: response.data.instrumentCode === i ? response.data.last : 0,
                                open24: response.data.instrumentCode === i ? response.data.open24H : 0
                            }}/>
                    ))}
            </Marquee>
            }
        </>
    );
}

export default React.memo(StockTicker);