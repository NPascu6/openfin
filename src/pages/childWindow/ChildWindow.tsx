import {IUseChildWindowOptions, useChildWindow} from "openfin-react-hooks";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import React from "react";
import {v4 as uuidv4} from 'uuid';
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {setTitle} from "../../redux/slices/app/appSlice";
import Test from "./Test";
import {TextField} from "@material-ui/core";
import {store} from "../../redux/store";

const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;

const ChildWindow: React.FC = () => {
    const dispatch = useDispatch()
    const {title} = useSelector((state: RootState) => state.app);

    const WINDOW_OPTIONS: WindowOption = {
        name: `WINDOW_NAME + ${uuidv4()}`,
        url: HTML_URL,
    }

    const CHILD_BODY_AS_HOOK_OPTION = (
        <div>
            <Provider store={store}>
                <Test/>
            </Provider>
            <TextField onChange={(e) => dispatch(setTitle(e.target.value))}/>
        </div>
    );


    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = {
        jsx: CHILD_BODY_AS_HOOK_OPTION,
        name: 'Child',
        parentDocument: document,
        windowOptions: WINDOW_OPTIONS,
    };

    const childWindow = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);

    return (
        <>
            {title}
            <button onClick={() => childWindow.launch(WINDOW_OPTIONS)}>Launch</button>
        </>
    )
};

export default ChildWindow;
