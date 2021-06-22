import React from "react";
import FadeIn from "react-fade-in";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import AppLoader from "./AppLoader";
import Main from "../app/Main";

const Page = () => {
    const firmState = useSelector((state: RootState) => state.bookkeeper.firm);

    return firmState
        ? (<FadeIn>Bookkeeper loaded</FadeIn>)
        : (<Main/>)
}

const AppLoading = () => {
    const isAppReady = useSelector((state: RootState) => state.app.isAppReady);
    return !isAppReady ? <AppLoader/> : <Page/>;
};

export default AppLoading;
