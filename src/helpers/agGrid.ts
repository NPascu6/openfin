import {red, teal} from "@material-ui/core/colors";
import {CellClassParams, ICellRendererParams, ValueFormatterParams, ValueGetterParams} from "ag-grid-community";
import moment from "moment";
import {formatPrice, numberFormatter} from "./app";

export const defaultColDef = {minWidth: 100, filter: true, resizable: true, sortable: true};

export const dateFilterParams = {
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
        const dateAsString = cellValue;
        if (dateAsString == null) return -1;
        const cellDate = moment(dateAsString).startOf("day").toDate();

        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
            return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
            return 1;
        }
    },
    browserDatePicker: true,
    minValidYear: 2019,
};

export const getGridTheme = (isDark: boolean): string => {
    return isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine"
}

export const currencyCellRenderer = (params: ICellRendererParams) => {
    if (params.value) {
        return `<span style='display:inline-block' class='currency ${params.value.toLowerCase()}'>&nbsp;</span><span style='display:inline-block'>${
            params.value
        }</span>`;
    }
};

export const venueCellRenderer = (params: ICellRendererParams) => {
    const value = params.valueFormatted ?? params.value;
    if (value) {
        return `<span style='display:inline-block' class='venue ${value.toLowerCase()}'>&nbsp;</span><span style='display:inline-block;text-transform: capitalize;'>${
            value
        }</span>`;
    }
};

export const dateValueGetter = (params: ValueGetterParams) => {
    if (params.data) return moment(params.data.timestamp).startOf("day");
}

export const dateValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return moment(params.value).format("DD MMM YYYY");
    return params.value;
};

export const timeValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return moment(params.value).format("HH:mm:ss");
    return params.value;
};

export const dateTimeValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return moment(params.value).format("DD/MM/YY HH:mm:ss");
    return params.value;
};

export const guidValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) {
        const parts = params.value.split("-");
        return parts[0];
    }
    return params.value;
};

export const quantityValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return numberFormatter.format(params.value);
    return params.value;
};

export const priceValueFormatter = (params: ValueFormatterParams) => {
    if (params.value) return formatPrice(params.value);
    return params.value;
};

export const sideCellStyle = (params: CellClassParams) => {
    if (params.value) {
        const center = {textAlign: "center", justifyContent: "center", textTransform: "capitalize"}
        if (params.value.toLowerCase() === "buy") {
            return {...center, ...{color: teal[400]}};
        }
        if (params.value.toLowerCase() === "sell") {
            return {...center, ...{color: red[400]}};
        }
    }
};

export const priceCellStyle = (params: CellClassParams | any) => {
    if (params.value) {
        if (params.value > 0) {
            return {color: teal[400]};
        }
        if (params.value < 0) {
            return {color: red[400]};
        }
    }
};