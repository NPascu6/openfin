import {useChannelClient} from "openfin-react-hooks";
import React, {useEffect, useState} from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import Topbar from "../../components/app/Topbar";
import {Grid} from "@material-ui/core";
import {store} from "../../redux/store";
import {MarketDataService} from "../../services/marketdata/MarketDataService";
import {setIsDarkTheme} from "../../redux/slices/app/appSlice";

const CHANNEL_NAME = "test";

const ChildWindow: React.FC = () => {
    const dispatch = useDispatch()
    const {client} = useChannelClient(CHANNEL_NAME);
    const {user} = useSelector((state: RootState) => state.app);
    const {childWindows} = useSelector((state: RootState) => state.mainChannel);
    const [connected, setConnected] = useState(false)
    const [, setResponse] = useState()

    useEffect(() => {
        const startMarketData = async () => {
            if (user && !connected) {
                debugger
                setConnected(true)
                const service = new MarketDataService()
                await service.registerUser(user)
                await service.start(setResponse)
            }
        }

        if (!connected && user && client) {
            startMarketData()
        }
    }, [connected, user, client])

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            addClientToList()
            client.register("setTheme", (payload: any) => dispatch(setIsDarkTheme(payload)))
        }
    }, [client, dispatch])

    return (
        <Grid container>
            <Topbar/>
            <Provider store={store}>
                <Grid container>
                    <button onClick={async () => await client.dispatch("increment")}>
                        Increment
                    </button>
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
            </Provider>
        </Grid>
    );
};

export default ChildWindow;