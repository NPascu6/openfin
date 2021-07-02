import {useChannelProvider} from "openfin-react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import React, {useEffect, useState} from "react";
import Prism from "prismjs";
import {clearClients, onConnection, onDisconnection} from "../../redux/slices/main-channel/mainChanelSlice";
import {Button, Grid} from "@material-ui/core";
import {createInitialWindows, mainWindowActions} from "./mainWindowActions";
import {closeChildWindows} from "../../common/utils";
import {ChannelProvider} from "openfin/_v2/api/interappbus/channel/provider";
import AuthService from "../../services/auth/AuthService";
import {setUser, setUserProfile} from "../../redux/slices/app/appSlice";
import {Identity} from "openfin/_v2/identity";

const CHANNEL_NAME = "test";

const MainWindow: React.FC = () => {
    const dispatch = useDispatch();
    const {childWindows, count} = useSelector((state: RootState) => state.mainChannel);
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

    return (
        <Grid container>
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
                    onClick={(e) => handleSignout(e, true)}
                >
                    Sign out
                </Button>
            </Grid>
            <Grid container>
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
        </Grid>
    );
}

export default MainWindow;