import MomentUtils from "@date-io/moment";
import {Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import React, {useEffect} from "react";
import Topbar from "./components/app/Topbar";
import {RoutesSwitch} from "./router/Routes";
import {initApp} from "./services/app/AppService";
import {useDispatch, useSelector} from "react-redux";
import Sidebar from "./components/app/Sidebar";
import {RootState} from "./redux/slices/rootSlice";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            height: "100vh",
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flex: 1,
        },
        pageArea: {
            padding: theme.spacing(1),
            flex: 1,
            overflow: "auto",
        },
    })
);

const App = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const profile = useSelector((state: RootState) => state.app.profile);

    useEffect(() => {
        if (!profile)
            dispatch(initApp());
    }, [dispatch, profile])

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.root}>
                <Topbar/>
                <Sidebar/>
                <Grid container direction="column" className={classes.content}>
                    <Grid className={classes.appBarSpacer}/>
                    <Grid container className={classes.pageArea}>
                        <RoutesSwitch/>
                    </Grid>
                </Grid>
            </div>
        </MuiPickersUtilsProvider>
    );
};

export default App