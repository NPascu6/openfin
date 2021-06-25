import MomentUtils from "@date-io/moment";
import {CssBaseline, Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import React from "react";
import {RoutesSwitch} from "../../router/Routes";
import Topbar from "./Topbar";
import {useLocation} from "react-use";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            height: "100vh",
            border: '1px solid black'
        },
        appBarSpacer: {
            height: '2em',
            minHeight: '2em',
            border: '1px solid black'
        },
        content: {
            flex: 1,
        },
        pageArea: {
            flex: 1,
            overflow: "auto",
        },

    })
);

const Main = () => {
    const classes = useStyles();
    const location = useLocation()

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.root}>
                <CssBaseline/>
                {(location.pathname === '/' || location.pathname === '/channel-provider')&& <Topbar/>}
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

export default Main;
