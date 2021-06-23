import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import AppLoader from "./AppLoader";
import Main from "../app/Main";

const Page = () => {

    return (<Main/>)
}

const AppLoading = () => {
    const isAppReady = useSelector((state: RootState) => state.app.isAppReady);
    return !isAppReady ? <AppLoader/> : <Page/>;
};

export default AppLoading;
