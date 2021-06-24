import {useDispatch} from "react-redux";
import {decrement, increment} from "../../redux/slices/chanel/chanelSlice";

export function CHILD_BODY_AS_HOOK_OPTION(): JSX.Element {
    const dispatch = useDispatch()

    const close = () => {


        const application = fin.desktop.Application.getCurrent();

        application.getChildWindows(function (children) {
            children.forEach(function (childWindow) {
                console.log("Showing child: " + childWindow.name);
                childWindow.close();
            });
        });
    }


    return <div>
        <button onClick={() => dispatch(increment())}>
            Increment
        </button>
        <button onClick={() => dispatch(decrement())}>
            Decrement
        </button>
        <button onClick={() => close()}>
            close
        </button>
    </div>;
}