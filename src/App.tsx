import {responsiveFontSizes} from "@material-ui/core";
import {Theme, ThemeProvider} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {initApp} from "./services/app/AppService";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./redux/slices/rootSlice";
import AppLoading from "./components/loading/AppLoading";
import {BrowserRouter} from "react-router-dom";
import {darkTheme, lightTheme} from "./themes";
import {setUser, setUserProfile} from "./redux/slices/app/appSlice";

const App = () => {
    const dispatch = useDispatch()
    const [theme, setTheme] = useState<Theme>();
    const {isDarkTheme, isAppReady, user} = useSelector((state: RootState) => state.app);

    useEffect(() => {
        setTheme(responsiveFontSizes(isDarkTheme ? darkTheme : lightTheme));
    }, [isDarkTheme])

    useEffect(() => {
        if(!user)
            dispatch(initApp());
    }, [dispatch, user])

    useEffect(() => {
        if (isAppReady) {
            console.log(`App ready: ${isAppReady}`)
            console.log(user)
            dispatch(setUser(user))
            if (user)
                dispatch(setUserProfile(user.profile))
        }
    }, [isAppReady, user, dispatch])

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme ?? lightTheme}>
                <AppLoading/>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App