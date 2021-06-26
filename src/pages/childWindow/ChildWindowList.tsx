import {Button, Dialog, Paper} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {setTopbarTitle} from "../../redux/slices/app/appSlice";
import {fetchActiveFundSummary} from "../../redux/thunks/bookkeeper";

const Transition = React.forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ChildWindowListProps {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const ChildWindowList = ({isOpen, setOpen} : ChildWindowListProps) => {
    const {activeFund} = useSelector((state: RootState) => state.bookkeeper);
const dispatch = useDispatch()
    const [localChildWindows, setChildWindows] = useState([])

    useEffect(() => {
        if (activeFund) {
            dispatch(setTopbarTitle({title: activeFund.name}));
            dispatch(fetchActiveFundSummary(activeFund.id));

            const application = fin.desktop.Application.getCurrent();
            let newChildren: any = []
            application.getChildWindows(function (children) {
                children.forEach(function (childWindow: { close: () => void; }) {
                    newChildren.push(childWindow)
                });
            });


            setChildWindows(newChildren)

        }
    }, [dispatch, activeFund]);



    return <Paper style={{flex: 1}}>
        <Dialog
            open={isOpen}
            // @ts-ignore
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpen(!isOpen)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                {localChildWindows && <DialogContentText id="alert-dialog-slide-description">
                    {localChildWindows?.map(c => c)}
                </DialogContentText>}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    Disagree
                </Button>
                <Button onClick={() => setOpen(false)} color="primary">
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
        </Paper>
}

export default ChildWindowList