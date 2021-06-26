import {ICellRendererParams} from "ag-grid-community";
import moment from "moment";
import {numberFormatter} from "./app";

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

export const venueCellRenderer = (params: ICellRendererParams) => {
    const value = params.valueFormatted ?? params.value;
    if (value) {
        return `<span style='display:inline-block' class='venue ${value.toLowerCase()}'>&nbsp;</span><span style='display:inline-block;text-transform: capitalize;'>${
            value
        }</span>`;
    }
};

export const dateValueFormatter = (params: any) => {
    if (params.value) return moment(params.value).format("DD MMM YYYY");
    return params.value;
};

export const timeValueFormatter = (params: any) => {
    if (params.value) return moment(params.value).format("HH:mm:ss");
    return params.value;
};

export const dateTimeValueFormatter = (params: any) => {
    if (params.value) return moment(params.value).format("DD/MM/YY HH:mm:ss");
    return params.value;
};

export const quantityValueFormatter = (params: any) => {
    if (params.value) return numberFormatter.format(params.value);
    return params.value;
};
