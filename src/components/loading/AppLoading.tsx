import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import AppLoader from "./AppLoader";
import Main from "../app/Main";
import NotFoundPage from "../../pages/errors/404";

const Page = () => {
    return (<Main/>)
}

const AppLoading = () => {
    const {isAppReady, user} = useSelector((state: RootState) => state.app);
    return !isAppReady ? <AppLoader/> : !user ? <NotFoundPage/> : <Page/>;
};

export default AppLoading;
