import {LinearProgress} from "@material-ui/core";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useDebounce} from "react-use";
import {RootState} from "../../redux/slices/rootSlice";
import Plot from "react-plotly.js";

const colorway = ["rgb(157,49,46)", "rgb(221,132,82)", "rgb(76,114,176)", "rgb(85,168,104)", "rgb(129,114,179)", "rgb(147,120,96)", "rgb(218,139,195)", "rgb(140,140,140)", "rgb(204,185,116)", "rgb(100,181,205)"]

const getLayout = (isDarkTheme: boolean) => {
    return {
        font: {
            family: `"Titillium Web", "Helvetica", "Arial", sans-serif`,
        },
        title: {
            text: "Portfolio Allocation",
            font: {
                color: isDarkTheme ? "#fff" : "#000"
            },
            x: 0.5,
            y: "auto",
            pad: {t: 10, b: 0, l: 0, r: 10}
        },
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent",
        autosize: true,
        margin: {t: 50, b: 5, l: 50, r: 5},
        showlegend: true,
        piecolorway: colorway,
        legend: {
            font: {
                color: isDarkTheme ? "#fff" : "#000"
            }
        }
    };
}

const AllocationPieChart = () => {
    const summaryRows = useSelector((state: RootState) => state.bookkeeper.activeSummaryRows);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [data, setData] = useState<any[]>();
    const [layout,] = useState(getLayout(isDarkTheme));
    const [config,] = useState({displaylogo: false, responsive: true});
    const [style] = useState({width: "100%", height: "100%"});

    useDebounce(
        () => {
            if (!summaryRows) return;
            const rows = summaryRows.filter(d => Math.abs(d.quantity ? d.quantity : 1) > 0.00001);
            const value = [
                {
                    type: "pie",
                    values: rows.map(d => d.value),
                    labels: rows.map(d => d.assetCode),
                    textinfo: "label+percent",
                    insidetextorientation: "radial",
                    automargin: true,
                    hole: .2,
                    textposition: "outside",
                    outsidetextfont: {
                        color: isDarkTheme ? "#fff" : "#000"
                    }
                },
            ];
            setData(value);
        },
        1000,
        [summaryRows]
    );

    return (
        data
            // @ts-ignore
            ? <Plot useResizeHandler={true} data={data} layout={layout ?? null} config={config} style={style}/>
            : <div style={{width: "100%", height: "100%"}}><LinearProgress/></div>
    );
};

export default React.memo(AllocationPieChart);
