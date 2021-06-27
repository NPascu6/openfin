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
import {MarketDataService} from "../../services/marketdata/MarketDataService";
import SummaryTable from "../dashboard/SummaryTable";
import ChildWindowList from "../childWindow/ChildWindowList";
import AuthService from "../../services/auth/AuthService";
import {fetchFirm} from "../../redux/thunks/bookkeeper";
import {setUser, setUserProfile} from "../../redux/slices/app/appSlice";
import {fetchCurrencies, fetchInstruments} from "../../redux/thunks/instrument";
import {useDebounce} from "react-use";
import {FundSummaryRow} from "../../services/bookKeeper/models";

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
    const {activeSummaryRows, activeFundSummary} = useSelector((state: RootState) => state.bookkeeper);
    const {instruments} = useSelector((state: RootState) => state.instrument);
    const {childWindows, count, statuses} = useSelector((state: RootState) => state.channel);
    const {user} = useSelector((state: RootState) => state.app);
    const [localCount, setLocalCount] = useState<number>(0)
    const [numberOfChildWindows, setNumberOfChildWindows] = useState(0)
    const [localProvider, setLocalProvider] = useState<ChannelProvider>()
    const {provider} = useChannelProvider(CHANNEL_NAME, mainWindowActions(dispatch));
    const [isChildWindowListOpen, setIsChildWindowListOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<any>([])
    const [localRows, setLocalRows] = useState<FundSummaryRow[]>([])

    const handleCloseAll = () => {
        const application = fin.desktop.Application.getCurrent();
        closeChildWindows(application)
        dispatch(clearClients())
        setNumberOfChildWindows(0)
    }

    const createChildWindows = async () => {
        let nrOfChildWindows = numberOfChildWindows
        const app = await fin.Application.getCurrent();

        let mainWindow = await fin.Window.getCurrent()
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

    const startMarketData = async () => {
        const service = new MarketDataService()
        if (user) {
            await service.registerUser(user);
            await service.start(setMessage)
            service.subscribeTicker(instruments?.map(c => c.code))
        }
    }

    const handleSignout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: boolean) => {
        e.preventDefault();
        if (value === true) {
            dispatch(setUser(null))
            dispatch(setUserProfile(null))
            await AuthService.removeUser()
            await AuthService.startSignoutMainWindow();
            return;
        }
    };

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
        if (activeSummaryRows) {
            setLocalRows(activeSummaryRows)
        }
    }, [activeSummaryRows])

    useDebounce(() => {
        const rows: FundSummaryRow[] = [];
        if (message && message.data) {
            activeSummaryRows?.forEach((r) => {
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

    }, 200, [message, activeSummaryRows])


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
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={() => dispatch(fetchFirm())}
                >
                    Get Firm
                </Button>
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={() => dispatch(fetchCurrencies())}
                >
                    Get Currencies
                </Button>
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={() => dispatch(fetchInstruments())}
                >
                    Get Instruments
                </Button>
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={(e) => handleSignout(e, true)}
                >
                    Sign out
                </Button>
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={() => startMarketData()}
                >
                    Start MArket Data
                </Button>
            </Grid>
            <Grid container>
                <SummaryTable activeSummaryRows={localRows ?? []}/>
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