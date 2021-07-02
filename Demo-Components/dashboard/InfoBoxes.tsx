import {Avatar, Box, Paper, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BarChartIcon from "@material-ui/icons/BarChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import clsx from "clsx";
import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Fund, FundSummaryRow} from "../../src/services/bookKeeper/models";
import {RootState} from "../../src/redux/slices/rootSlice";


interface InfoBoxesProps {
    tickerMessages: any;
}

export interface InfoBoxProps {
    key: string,
    title: string;
    value: any;
    changeIndication: boolean;
    formatter?: (arg0: any) => string,
    avatar: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flex: 1,
            padding: theme.spacing(3)
        },
        box: {
            flexGrow: 1
        },
        title: {
            color: theme.palette.action.active,
            textTransform: "uppercase"
        },
        value: {
            fontWeight: "bold"
        },
        avatar: {
            width: "3em",
            height: "3em",
        },
        avatarDark: {
            backgroundColor: theme.palette.secondary.main,
        },
        avatarLight: {
            backgroundColor: theme.palette.primary.main,
        },
        avatarIcon: {
            width: "1.5em",
            height: "1.5em"
        },
        positive: {
            color: theme.palette.success.main
        },
        negative: {
            color: theme.palette.error.main
        }
    })
);

const defaultInfoBoxProps: InfoBoxProps [] = [
    {
        key: "value",
        title: "Market Value",
        value: 0,
        changeIndication: true,
        avatar: AttachMoneyIcon
    }, {
        key: "realizedPnl",
        title: "Realized P&L",
        value: 0,
        changeIndication: true,
        avatar: TrendingUpIcon
    }, {
        key: "unrealizedPnl",
        title: "Unrealized P&L",
        value: 0,
        changeIndication: true,
        avatar: TimelineIcon
    }, {
        key: "totalPnl",
        title: "Total P&L",
        value: 0,
        changeIndication: true,
        avatar: BarChartIcon
    }];

const InfoBox = (props: InfoBoxProps) => {
    const classes = useStyles();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

    const getClassName = (props: InfoBoxProps) => {
        if (props.value === 0 || !props.changeIndication)
            return "";

        return clsx(props.value > 0 ? classes.positive : classes.negative);
    };

    return (
        <Paper elevation={3} className={classes.root}>
            <Box className={classes.box}>
                <Typography variant="subtitle2" className={classes.title}>{props.title}</Typography>
                <Typography variant="h5" className={clsx(getClassName(props), classes.value)}>
                    {props.formatter ? props.formatter(props.value) : props.value}
                </Typography>
            </Box>
            <Avatar className={clsx(classes.avatar, isDarkTheme ? classes.avatarDark : classes.avatarLight)}>
                <props.avatar className={classes.avatarIcon}/>
            </Avatar>
        </Paper>
    )
}

const InfoBoxes = ({tickerMessages}: InfoBoxesProps) => {
    const {activeFund, activeSummaryRows} = useSelector((state: RootState) => state.bookkeeper);
    const dataRows = useRef<FundSummaryRow[] | undefined>(activeSummaryRows);
    const [infoBoxProps, setInfoBoxProps] = useState<InfoBoxProps[]>(defaultInfoBoxProps);
    const [localFund, setLocalFund] = useState<Fund>();


    useEffect(() => {
        if (activeFund) {
            setLocalFund(activeFund)
        }
    }, [activeFund])

    useEffect(() => {
        const processInfoBoxProps = (rows: any) => {
            if (!rows) return;

            // @ts-ignore
            const totalMarketValue = rows.reduce((prev, curr) => prev + curr.value, 0);
            // @ts-ignore
            const totalPnl = rows.reduce((prev, curr) => prev + curr.unrealizedPnl + curr.realizedPnl, 0);
            // @ts-ignore
            const realizedPnl = rows.reduce((prev, curr) => prev + curr.realizedPnl, 0);
            // @ts-ignore
            const unrealizedPnl = rows.reduce((prev, curr) => prev + curr.unrealizedPnl, 0);

            setInfoBoxProps(props => {
                props.forEach(box => {
                    if (box.key === "value")
                        box.value = totalMarketValue;

                    if (box.key === "totalPnl")
                        box.value = totalPnl;

                    if (box.key === "realizedPnl")
                        box.value = realizedPnl;

                    if (box.key === "unrealizedPnl")
                        box.value = unrealizedPnl;
                });
                return props;
            });
        };


        if (!dataRows.current && activeSummaryRows) {
            processInfoBoxProps(activeSummaryRows);
        }

        dataRows.current = activeSummaryRows;
    }, [activeSummaryRows]);


    useEffect(() => {
        if (localFund) {
            const numberFormatter =
                new Intl.NumberFormat("en", {style: "currency", currency: localFund.currency});
            const props = [...defaultInfoBoxProps];
            props.forEach(box => {
                if (box.key === "value") {
                    box.formatter = (value: any): string => {
                        return numberFormatter.format(value);
                    };
                } else {
                    box.formatter = (value: any): string => {
                        const sign = value > 0 ? "+" : "";
                        return `${sign}${numberFormatter.format(value)}`;
                    };
                }
            });

            setInfoBoxProps(props);
        }
    }, [localFund]);

    return (
        <>
            {infoBoxProps?.map((box, index) => (
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3} key={`box-${index}`}>
                    <InfoBox changeIndication={box.changeIndication} key={box.key} title={box.title} value={box.value}
                             avatar={box.avatar}
                             formatter={box.formatter}/>
                </Grid>
            ))}
        </>
    )
};

export default React.memo(InfoBoxes);