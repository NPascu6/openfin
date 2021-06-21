import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./app/appSlice";

const appPersistConfig = {
    key: 'app',
    storage: storage,
};

const rootSlice = combineReducers({
    app: persistReducer(appPersistConfig, appReducer),
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
