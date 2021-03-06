import {_Window} from "openfin/_v2/api/window/window";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

const useWindow = (initialOptions: WindowOption = {}) => {
    const [options, setOptions] = useState(initialOptions);
    const [win, setWin] = useState<_Window>();

    useEffect(() => {
        let newWindow: _Window;

        const createWindow = async () => {
            newWindow = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: uuidv4(),
                url: "about:blank",
                ...options,
            });
            setWin(newWindow);
        };

        createWindow();

        return () => {
            if (newWindow) {
                newWindow.close()
            }
        };
    }, [options]);

    return [win, setOptions];
};

export default useWindow
