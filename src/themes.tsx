import {createMuiTheme, darken} from "@material-ui/core";
import {blue, orange, red, teal} from "@material-ui/core/colors";

export const lightTheme = createMuiTheme({
    typography: {
        fontFamily: `"Titillium Web", "Helvetica", "Arial", sans-serif`,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600
    },
    palette: {
        type: "light",
        primary: {
            main: "#9f2924",
        },
        secondary: {
            main: "#5d6767",
        },
        success: {
            main: teal[500],
        },
        warning: {
            main: orange[800],
        },
        error: {
            main: red[900],
        },
        info: {
            main: blue[900],
        },
        background: {
            default: "#f1f1f1",
        },
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "*::-webkit-scrollbar": {
                    width: ".5em",
                    height: ".5em"
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#fafafa",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c2c2c2",
                    borderRadius: 10,
                    backgroundClip: "content-box"
                },
                "*::-webkit-scrollbar-corner": {
                    backgroundColor: "#fafafa",
                }
            },
        }
    }
});

export const darkTheme = createMuiTheme({
    typography: {
        fontFamily: `"Titillium Web", "Helvetica", "Arial", sans-serif`,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600
    },
    palette: {
        type: "dark",
        primary: {
            main: darken("#9f2924", .2),
        },
        secondary: {
            main: "#fc851e",
        },
        success: {
            main: teal[400],
        },
        error: {
            main: red[600],
        },
        info: {
            main: blue[800],
        },
        background: {
            paper: "#181d1f",
            default: "#222628",
        },
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "*::-webkit-scrollbar": {
                    width: ".5em",
                    height: ".5em"
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "#181d1f",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#68686e",
                    borderRadius: 10,
                    backgroundClip: "content-box"
                },
                "*::-webkit-scrollbar-corner": {
                    backgroundColor: "#fafafa",
                }
            },
        }
    }
});