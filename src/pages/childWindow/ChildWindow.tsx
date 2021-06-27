import {useChannelClient} from "openfin-react-hooks";
import Ticker from "../../components/common/Ticker";
import React, {useEffect, useState} from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import Topbar from "../../components/app/Topbar";
import {CircularProgress, Grid} from "@material-ui/core";
import {FundSummaryRow} from "../../services/bookKeeper/models";
import SummaryTable from "../dashboard/SummaryTable";
import {store} from "../../redux/store";
import {initApp} from "../../services/app/AppService";
import {MarketDataService} from "../../services/marketdata/MarketDataService";
import {fetchActiveFundSummary} from "../../redux/thunks/bookkeeper";
import AccountCards from "../dashboard/AccountCards";

const CHANNEL_NAME = "test";

const ChildWindow: React.FC = () => {
    const dispatch = useDispatch()
    const {client} = useChannelClient(CHANNEL_NAME);
    const [message, setMessage] = useState<any>()
    const {instruments} = useSelector((state: RootState) => state.instrument);
    const {user} = useSelector((state: RootState) => state.app);
    const [, setLocalTicker] = useState(0)
    const {activeSummaryRows, activeFundSummary, firm, activeFundId} = useSelector((state: RootState) => state.bookkeeper);
    const {childWindows} = useSelector((state: RootState) => state.channel);
    const [loader, setLoader] = useState<boolean>(true)
    const [localRows, setLocalRows] = useState<FundSummaryRow[]>()
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        dispatch(initApp())
    }, [dispatch])

    useEffect(() => {
        if (activeFundId) {
            dispatch(fetchActiveFundSummary(activeFundId))
        }
    }, [activeFundId, dispatch])

    useEffect(() => {
        if (activeSummaryRows) {
            setLocalRows(activeSummaryRows)
        }
    }, [activeSummaryRows])

    useEffect(() => {
        const startMarketData = async () => {
            if (user) {
                const service = new MarketDataService()
                await service.registerUser(user)
                await service.start(setMessage)
                await service.subscribeTicker(instruments?.map(i => i.code))
                setConnected(true)
                setLoader(false)
            }
        }

        if (localRows && !connected) {
            startMarketData()
        }
    }, [localRows, connected, instruments, user])

    useEffect(() => {
        const rows: FundSummaryRow[] = [];
        if (message && message.data) {
            localRows?.forEach((r) => {
                const row = {...r};

                Object.keys(message.data).forEach((key: any) => {
                    if (row.quantity && row.quantity > 0)
                        if (row && row.instrumentCode === message.data.instrumentCode && r && r.price) {
                            const last = +message.data.last;
                            const prev = +r.price;
                            const change = ((last - prev) / prev) * 100;
                            row.price = last;
                            row.value = row.quantity ? row.quantity : 1 * row.price;
                            row.pctChange = change;
                            if (row.open24H)
                                row.pct24HChange = row.open24H === 0 ? 0 : ((last - row.open24H) / row.open24H) * 100;
                            if (row.averageCost && row.quantity)
                                row.unrealizedPnl = row.averageCost === 0 ? 0 : (last - row.averageCost) * row.quantity;
                        }
                });

                rows.push(row);
            });

            setLocalRows(rows)
        }
    }, [message])

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            addClientToList()
        }
    }, [client])

    return (
        <Grid container>
            <Topbar/>

            <Provider store={store}>

                <Grid container>
                    {firm?.name}
                    <Ticker setLocalTicker={setLocalTicker}/>
                    <button onClick={async () => await client.dispatch("increment")}>
                        Increment
                    </button>
                </Grid>
                <Grid container>
                    <AccountCards/>
                </Grid>
                <Grid container>
                    <button onClick={async () => await client.dispatch("decrement")}>
                        Decrement
                    </button>
                    <button
                        onClick={async () =>
                            await client.dispatch("close", {
                                windowName: window.fin.Window.getCurrentSync().identity.name,
                                childWindows
                            })
                        }
                    >
                        Close
                    </button>
                </Grid>
                {loader ? <CircularProgress disableShrink/> : <Grid container>
                    <SummaryTable activeSummaryRows={localRows ?? []} activeFundSummary={activeFundSummary}/>
                </Grid>}
            </Provider>

        </Grid>
    );
};

export default ChildWindow;