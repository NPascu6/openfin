import {useDispatch} from "react-redux";
import {decrement, increment} from "../../redux/slices/chanel/chanelSlice";

export function CHILD_BODY_AS_HOOK_OPTION(): JSX.Element {
    const dispatch = useDispatch()

    return <div>
        <button onClick={() => dispatch(increment())}>
            Increment
        </button>
        <button onClick={() => dispatch(decrement())}>
            Decrement
        </button>
    </div>;
}