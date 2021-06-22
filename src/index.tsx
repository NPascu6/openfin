import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistor, store} from "../src/redux/store";
import {BrowserRouter as Router} from "react-router-dom";

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router><App/></Router>
            </PersistGate>
        </Provider>,
        document.querySelector("#root")
    );
};

render();