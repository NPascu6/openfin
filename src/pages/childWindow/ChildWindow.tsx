import {useChannelClient} from "openfin-react-hooks";
import Ticker from "../../components/common/Ticker";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import Topbar from "../../components/app/Topbar";
import InfoBoxes from "../dashboard/InfoBoxes";
import {Grid} from "@material-ui/core";

const CHANNEL_NAME = "test";

const ChildWindow: React.FC = () => {
    const [, setLocalTicker] = useState(0)
    const {childWindows} = useSelector((state: RootState) => state.channel);
    const {client} = useChannelClient(CHANNEL_NAME);

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            addClientToList()
        }
    }, [client])

    return (
        <div>
            <Topbar/>
            <Grid container>
                <InfoBoxes/>
            </Grid>
            <Grid container>
                <Ticker setLocalTicker={setLocalTicker}/>
                <button onClick={async () => await client.dispatch("increment")}>
                    Increment
                </button>
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
        </div>
    );
};

export default ChildWindow;