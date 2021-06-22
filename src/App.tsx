import {responsiveFontSizes} from "@material-ui/core";
import {Theme, ThemeProvider} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {initApp} from "./services/app/AppService";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./redux/slices/rootSlice";
import AppLoading from "./components/loading/AppLoading";
import {BrowserRouter} from "react-router-dom";
import {darkTheme, lightTheme} from "./themes";

const App = () => {
    const dispatch = useDispatch()
    const profile = useSelector((state: RootState) => state.app.profile);
    const [theme, setTheme] = useState<Theme>();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const isAppReady = useSelector((state: RootState) => state.app.isAppReady);

    useEffect(() => {
        setTheme(responsiveFontSizes(isDarkTheme ? darkTheme : lightTheme));
    }, [isDarkTheme])

    useEffect(() => {
        if (!profile && !isAppReady){
            debugger
            dispatch(initApp());
        }

    }, [dispatch, profile, isAppReady])

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme ?? lightTheme}>
                <AppLoading/>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App