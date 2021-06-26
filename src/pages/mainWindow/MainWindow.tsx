import {useChannelProvider} from "openfin-react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import React, {useEffect, useState} from "react";
import Prism from "prismjs";
import {Identity} from "openfin/_v2/identity";
import {clearClients, onConnection, onDisconnection, setPushMessage,} from "../../redux/slices/chanel/chanelSlice";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import {createInitialWindows, mainWindowActions} from "./mainWindowActions";
import {closeChildWindows, closeWindowRemote} from "../../common/utils";
import {ChannelProvider} from "openfin/_v2/api/interappbus/channel/provider";
import MarketDataService from "../../services/marketdata/MarketDataService";
import SummaryTable from "../dashboard/SummaryTable";
import ChildWindowList from "../childWindow/ChildWindowList";

const CHANNEL_NAME = "test";


// const ProfilePage = () => {
//     const dispatch = useDispatch();
//     const [numberOfChildWindows, setNumberOfChildWindows] = useState<number>(0)
//
//     const handleCloseAll = () => {
//         const application = fin.desktop.Application.getCurrent();
//         closeChildWindows(application)
//         dispatch(clearClients())
//         setNumberOfChildWindows(0)
//     }
//     const handleSignout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: boolean) => {
//         e.preventDefault();
//
//         dispatch(setUser(null))
//         dispatch(setUserProfile(null))
//         dispatch(setIsSignoutOpen(false));
//         handleCloseAll()
//
//         if (value === true) {
//             await AuthService.startSignoutMainWindow();
//             return;
//         }
//     };
//
//     return  <Grid container>
//         <Button
//             style={{height: '2.5em', fontSize: 12}}
//             size={"small"}
//             variant={'outlined'} onClick={(e) => handleSignout(e, true)}>Sign out</Button>
//     </Grid>
// }

const MainWindow: React.FC = () => {
    const dispatch = useDispatch();
    const {activeFundSummary} = useSelector((state: RootState) => state.bookkeeper);
    const {childWindows, count, statuses} = useSelector((state: RootState) => state.channel);
    const [localCount, setLocalCount] = useState<number>(0)
    const [numberOfChildWindows, setNumberOfChildWindows] = useState(0)
    const [localProvider, setLocalProvider] = useState<ChannelProvider>()
    const {provider} = useChannelProvider(CHANNEL_NAME, mainWindowActions(dispatch));
    const [isChildWindowListOpen, setIsChildWindowListOpen] = useState<boolean>(false)

    const handleCloseAll = () => {
        const application = fin.desktop.Application.getCurrent();
        closeChildWindows(application)
        dispatch(clearClients())
        setNumberOfChildWindows(0)
    }

    const createChildWindows = async () => {
        let nrOfChildWindows = numberOfChildWindows
        const app = await fin.Application.getCurrent();

        let mainWindow =await fin.Window.getCurrent()
        if (numberOfChildWindows < 3)
            for (let i = 0; i < 3; i++) {
                createInitialWindows(nrOfChildWindows, dispatch, setNumberOfChildWindows).then(async () => {
                    let child = await app.getChildWindows()
                    if (child)
                        child[i].joinGroup(mainWindow)
                })
                nrOfChildWindows++
                setNumberOfChildWindows(nrOfChildWindows)
            }
        else {
            const application = fin.desktop.Application.getCurrent();
            closeChildWindows(application)
            createChildWindows()
        }
    }

    useEffect(() => {
        if (provider) {
            provider.onConnection((identity: Identity) => {
                dispatch(onConnection(identity));
            });
            provider.onDisconnection((identity: Identity) => {
                dispatch(onDisconnection(identity));
            });
            setLocalProvider(provider)
        }
        Prism.highlightAll();
    }, [provider, dispatch]);

    useEffect(() => {
        if (count) {
            setLocalCount(count)
        }
    }, [count])

    useEffect(() => {
        if (!activeFundSummary) return;

        if (MarketDataService.isConnected) {
            const subscribeData = async () => {
                if (activeFundSummary.assets) {
                    await MarketDataService.subscribeTicker(
                        activeFundSummary.assets
                            .filter((a) => a.asset !== activeFundSummary.currency)
                            ?.map((r) => `${r.asset}-${activeFundSummary.currency}`)
                    );
                }
            };

            subscribeData().then();
        }

    }, [activeFundSummary]);


    return (
        <Grid container>
            <Grid item>
                <TextField
                    variant={"outlined"}
                    size={"small"}
                    placeholder="Type your message"
                    type="text"
                    onChange={(e) =>
                        dispatch(setPushMessage(e.target.value))
                    }
                />
            </Grid>
            <Grid item>
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={() => provider.publish("pushMessage", localProvider)}
                    disabled={Object.keys(childWindows).length === 0}
                >
                    Push
                </Button>
            </Grid>
            <Grid container>
                <SummaryTable/>
            </Grid>
            <Grid container>
                <Grid item>
                    {statuses && statuses.map((c, key) => (
                        <div key={key}>
                            <Typography variant={"body2"}>{key + ' - ' + c.msg}</Typography>
                            <Button
                                variant={"outlined"}
                                size={"small"} onClick={() => closeWindowRemote(c.name, dispatch)}>close</Button>
                        </div>
                    ))}
                </Grid>
                <Grid item>
                    <Button
                        variant={"outlined"}
                        size={"small"} onClick={() => createChildWindows()}>Create Child Windows</Button>
                    <Button
                        variant={"outlined"}
                        size={"small"} onClick={() => setIsChildWindowListOpen(!isChildWindowListOpen)}>Open Child
                        Window list</Button>
                </Grid>
                <Grid item>
                    <Button
                        variant={"outlined"}
                        size={"small"} onClick={() => handleCloseAll()}>Close All Child</Button>
                </Grid>
            </Grid>
            <Grid container>
                <strong>Count:</strong> {localCount}
            </Grid>
            <ChildWindowList isOpen={isChildWindowListOpen}
                             setOpen={setIsChildWindowListOpen}/>
        </Grid>
    );
}

export default MainWindow;