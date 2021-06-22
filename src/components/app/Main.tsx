import MomentUtils from "@date-io/moment";
import {CssBaseline, Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import React from "react";
import {RoutesSwitch} from "../../router/Routes";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

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
            flex: 1,
            overflow: "auto",
        },
    })
);

const Main = () => {
    const classes = useStyles();

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.root}>
                <CssBaseline/>
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

export default Main;
