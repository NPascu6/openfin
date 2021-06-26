import {Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {GridOptions, GridReadyEvent} from "ag-grid-community";
import {GridApi} from "ag-grid-community/dist/lib/gridApi";
import {AgGridColumn} from "ag-grid-react";
import {AgGridReact} from "ag-grid-react/lib/agGridReact";
import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getGridTheme} from "../../helpers/agGrid";
import {RootState} from "../../redux/slices/rootSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flex: 1,
        },
        summaryGrid: {
            flex: 1,
            width: "100%",
            minHeight: '20em'
        },
        positive: {
            color: theme.palette.success.main
        },
        negative: {
            color: theme.palette.error.main
        },
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
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const {activeSummaryRows} = useSelector((state: RootState) => state.bookkeeper);
    const [gridTheme, setGridTheme] = useState(getGridTheme(isDarkTheme));
    const [gridApi, setGridApi] = useState<GridApi>();

    const onGridReady = (params: GridReadyEvent) => {
        params.api.sizeColumnsToFit();
        params.api.setRowData(activeSummaryRows ?? []);
        setGridApi(params.api);
    };

    useEffect(() => {
        const handleResize = () => {
            if (gridApi) {
                gridApi?.sizeColumnsToFit()
            }
        }

        window.addEventListener('resize', handleResize)
    }, [gridApi])

    useEffect(() => {
        setGridTheme(getGridTheme(isDarkTheme));
    }, [isDarkTheme]);

    useEffect(() => {
        const transaction = gridApi?.getModel().isEmpty() ? {add: activeSummaryRows} : {update: activeSummaryRows};
        gridApi?.applyTransactionAsync(transaction);
    }, [activeSummaryRows, gridApi]);

    return (
        <Paper elevation={3} className={classes.root}>
            <div className={clsx(gridTheme, classes.summaryGrid)}>
                <AgGridReact gridOptions={gridOptions} onGridReady={onGridReady} asyncTransactionWaitMillis={1000}>
                    <AgGridColumn
                        headerName="Asset"
                        field="assetCode"
                        minWidth={190}
                        pinned="left"/>
                    <AgGridColumn
                        headerName="Quantity"
                        field="quantity"
                        flex={1}/>
                    <AgGridColumn
                        headerName="Average Cost"
                        field="averageCost"/>
                    <AgGridColumn
                        headerName="Market Price"
                        field="price"/>
                    <AgGridColumn
                        headerName="% 24H"
                        field="pct24HChange"/>
                    <AgGridColumn
                        headerName="Market Value"
                        field="value"
                        tooltipField="value"
                        type="numericColumn"
                        filter="agNumberColumnFilter"
                        minWidth={150}/>
                    <AgGridColumn
                        headerName="Realized P&L"
                        field="realizedPnl"
                        tooltipField="realizedPnl"
                        type="numericColumn"
                        filter="agNumberColumnFilter"
                        minWidth={140}/>
                    <AgGridColumn
                        headerName="Unrealized P&L"
                        field="unrealizedPnl"
                        minWidth={140}/>
                    <AgGridColumn
                        headerName="Total P&L"/>
                    <AgGridColumn
                        headerName="Allocation"
                        field="pctPortfolio"
                        hide={true}/>
                </AgGridReact>
            </div>
        </Paper>
    );
};

export default React.memo(SummaryTable);
