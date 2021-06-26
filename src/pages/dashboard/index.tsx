import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React, {lazy, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPageTitle} from "../../helpers/app";
import MarketDataService from "../../services/marketdata/MarketDataService";
import {setTopbarTitle} from "../../redux/slices/app/appSlice";
import {RootState} from "../../redux/slices/rootSlice";
import {fetchActiveFundSummary} from "../../redux/thunks/bookkeeper";
import AccountCards from "./AccountCards";
import InfoBoxes from "./InfoBoxes";
import SummaryTable from "./SummaryTable";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flex: 1,
            padding: theme.spacing(2)
        },
        chart: {
            flex: 1,
        },
        summary: {
            display: "flex",
            minHeight: "36em",
        },
    })
);

const AllocationPieChart = lazy(() => import("./AllocationPieChart"));

const Dashboard = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {activeFund, activeFundSummary} = useSelector((state: RootState) => state.bookkeeper);

    useEffect(() => {
        if (activeFund) {
            dispatch(setTopbarTitle({title: activeFund.name}));
            dispatch(fetchActiveFundSummary(activeFund.id));
            setPageTitle("Home");
        }
    }, [dispatch, activeFund]);

    useEffect(() => {
        if (!activeFundSummary) return;

        if (!MarketDataService.isConnected) {
            const subscribeData = async () => {
                await MarketDataService.start();
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
        <div className={classes.root}>
            <Grid container spacing={2} justify="flex-start">
                <InfoBoxes/>
                <Grid item xs={12} md={12} lg={9} className={classes.summary}>
                    <SummaryTable/>
                </Grid>
                <Grid item xs={12} md={12} lg={3} className={classes.summary}>
                    <Paper elevation={3} className={classes.chart}>
                        <AllocationPieChart/>
                    </Paper>
                </Grid>
                <AccountCards/>
            </Grid>
        </div>
    );
};

export default React.memo(Dashboard);
