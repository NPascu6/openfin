import {useChannelClient} from "openfin-react-hooks";
import React, {useEffect} from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import Topbar from "../../components/app/Topbar";
import {Button, Grid} from "@material-ui/core";
import {store} from "../../redux/store";
import {setIsDarkTheme} from "../../redux/slices/app/appSlice";
import {fetchOtcInstruments} from "../../redux/thunks/instrument";
import {setSelectedInstruments} from "../../redux/slices/instrument/instrumentSlice";
import SummaryTable from "../../components/market-data-window/SummaryTable";

const CHANNEL_NAME = "MainChanel";

const MarketDataWindow: React.FC = () => {
    const dispatch = useDispatch()
    const {client} = useChannelClient(CHANNEL_NAME);
    const {childWindows} = useSelector((state: RootState) => state.mainChannel);
    const {instruments} = useSelector((state: RootState) => state.instrument);

    useEffect(() => {
        if (!instruments) {
            dispatch(fetchOtcInstruments())
        }
    }, [instruments, dispatch])

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            addClientToList()
            client.register("setTheme", (payload: any) => dispatch(setIsDarkTheme(payload)))
            client.register("setSelectedInstruments", (payload: any) => dispatch(setSelectedInstruments(payload)))
        }
    }, [client, dispatch])

    return (
        <Grid container>
            <Topbar/>
            <Provider store={store}>
                <Grid container item style={{height: '100%'}}>
                    <SummaryTable/>
                </Grid>
                <Grid container item>
                    <Button variant={"outlined"} onClick={async () => await client.dispatch("increment")}>
                        Increment
                    </Button>
                    <Button variant={"outlined"} onClick={async () => await client.dispatch("decrement")}>
                        Decrement
                    </Button>
                    <Button
                        variant={"outlined"}
                        onClick={async () =>
                            await client.dispatch("close", {
                                windowName: window.fin.Window.getCurrentSync().identity.name,
                                childWindows
                            })
                        }
                    >
                        Close
                    </Button>
                </Grid>
            </Provider>
        </Grid>
    );
};

export default React.memo(MarketDataWindow);