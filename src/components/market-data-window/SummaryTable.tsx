import {Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {GridOptions, GridReadyEvent} from "ag-grid-community";
import {GridApi} from "ag-grid-community/dist/lib/gridApi";
import {AgGridColumn} from "ag-grid-react";
import {AgGridReact} from "ag-grid-react/lib/agGridReact";
import clsx from "clsx";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getGridTheme} from "../../helpers/agGrid";
import {RootState} from "../../redux/slices/rootSlice";
import {MarketDataService} from "../../services/marketdata/MarketDataService";
import {fetchActiveFundSummary, fetchFirm} from "../../redux/thunks/bookkeeper";
import {useDebounce} from "react-use";
import {FundSummaryRow} from "../../services/bookKeeper/models";
import {setActiveSummaryRows} from "../../redux/slices/book-keeper/bookkeeperSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flex: 1,
        },
        summaryGrid: {
            flex: 1,
            width: "100%"
        },
        positive: {
            color: theme.palette.success.main
        },
        negative: {
            color: theme.palette.error.main
        }
    })
);

const defaultColDef = {filter: true, resizable: true, sortable: true, enableCellChangeFlash: true};

const gridOptions: GridOptions = {
    defaultColDef: defaultColDef,
    enableRangeSelection: true,
    enableCellTextSelection: false,
    animateRows: true,
    getRowNodeId: (data) => {
        return data.assetCode;
    },
    statusBar: {
        statusPanels: [
            {
                statusPanel: "agAggregationComponent",
                statusPanelParams: {
                    // possible values are: 'count', 'sum', 'min', 'max', 'avg'
                    aggFuncs: ["min", "max", "avg", "sum"]
                }
            }
        ]
    },
};

const SummaryTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {isDarkTheme, user} = useSelector((state: RootState) => state.app);
    const {activeSummaryRows} = useSelector((state: RootState) => state.bookkeeper);
    const {instruments} = useSelector((state: RootState) => state.instrument);
    const [gridTheme, setGridTheme] = useState(getGridTheme(isDarkTheme));
    const [gridApi, setGridApi] = useState<GridApi>();
    const [service, setService] = useState<any>()
    const [response, setResponse] = useState<any>()
    const [connected, setConnected] = useState(false)
    const {activeFund, activeFundSummary} = useSelector((state: RootState) => state.bookkeeper);
    const [dataRows, setDataRows] = useState<any>()

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
        params.api.setRowData(activeSummaryRows ?? []);
        setGridApi(params.api);
    };

    useEffect(() => {
        setGridTheme(getGridTheme(isDarkTheme));
    }, [isDarkTheme]);

    useEffect(() => {
        if(activeSummaryRows && !dataRows){
            gridApi?.applyTransactionAsync({add: activeSummaryRows});
        }
        else if(dataRows){
            gridApi?.applyTransactionAsync({update: dataRows});
        }
    }, [activeSummaryRows, dataRows, gridApi]);

    useEffect(() => {
        if (!response) return;

        const getRows = () => {
            const rows: FundSummaryRow[] = [];

            activeSummaryRows?.forEach((r: any) => {
                const row = {...r};
                if (row)
                    dataRows?.forEach((row: any) => {
                        if (row && row.quantity && row.averageCost && row.open24H && row.instrumentCode === response.data.instrumentCode) {
                            const last = +response.data.last;
                            row.price = last;
                            row.value = row.quantity * row.price;
                            row.pct24HChange = row.open24H === 0 ? 0 : ((last - row.open24H) / row.open24H) * 100;
                            row.unrealizedPnl = row.averageCost === 0 ? 0 : (last - row.averageCost) * row.quantity;
                        }
                    });

                rows.push(row);
            });

            // @ts-ignore
            const sum = rows?.reduce((previousValue, currentValue) => previousValue + currentValue?.value ? currentValue.value : 1, 0);

            rows?.forEach((row) => (row.pctPortfolio = (row?.value ? row.value : 1 / +sum) * 100));

            return rows;
        };

        const rows = getRows();
        setDataRows(rows);
    }, [response])


    useEffect(() => {
        const startMarketData = async () => {
            if (user && !connected && !service) {
                setConnected(true)
                const newService = new MarketDataService()
                await newService.registerUser(user)
                await newService.start(setResponse)
                setService(newService)
            }
        }

        if (!connected && user && instruments) {
            startMarketData()
        }
    }, [connected, user, instruments, service])

    useEffect(() => {
        if (service && activeSummaryRows) {
            service.unsubscribe()
            service.subscribeTicker(activeFundSummary?.assets
                .filter((a) => a.asset !== activeFundSummary.currency)
                ?.map((r) => `${r.asset}-${activeFundSummary.currency}`))
        }

    }, [service, activeFundSummary, activeSummaryRows])

    useEffect(() => {
        if (activeFund) {
            dispatch(fetchActiveFundSummary(activeFund.id));
        }

        if (!activeFund) {
            dispatch(fetchFirm(true));
        }

        const x = setInterval(() => {
            dispatch(fetchFirm(true));
        }, 60000);

        return () => {
            clearInterval(x);
        }
    }, [dispatch, activeFund]);

    const NumberCellRenderer = (props: any) => {
        return <span>{props.value?.toFixed(4)}</span>;
    }

    const frameworkComponents = {
        'numberCellRenderer': NumberCellRenderer
    };
    // @ts-ignore
    return (
        <Paper elevation={3} className={classes.root}>
            <div className={clsx(gridTheme, classes.summaryGrid)}>
                <AgGridReact
                    gridOptions={gridOptions}
                    onGridReady={onGridReady}
                    frameworkComponents={frameworkComponents}
                    asyncTransactionWaitMillis={1000}>
                    <AgGridColumn
                        headerName="Asset"
                        field="assetCode"
                        pinned="left"/>
                    <AgGridColumn
                        headerName="Quantity"
                        field="quantity"
                        tooltipField="quantity"
                        cellRenderer={'numberCellRenderer'}
                    />
                    <AgGridColumn
                        headerName="Average Cost"
                        field="averageCost"
                        type="numericColumn"
                        cellRenderer={'numberCellRenderer'}
                    />
                    <AgGridColumn
                        headerName="Market Price"
                        field="price"
                        type="numericColumn"
                        cellRenderer={'numberCellRenderer'}
                    />
                    <AgGridColumn
                        headerName="% 24H"
                        field="pct24HChange"
                        type="numericColumn"
                        cellRenderer={'numberCellRenderer'}
                    />
                    <AgGridColumn
                        headerName="Market Value"
                        field="value"
                        tooltipField="value"
                        cellRenderer={'numberCellRenderer'}
                    />
                </AgGridReact>
            </div>
        </Paper>
    );
};

export default React.memo(SummaryTable);
