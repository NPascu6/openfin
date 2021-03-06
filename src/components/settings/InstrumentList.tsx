import React, {useEffect} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {v4 as uuidv4} from 'uuid';
import {setSelectedInstruments} from "../../redux/slices/instrument/instrumentSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export default function InstrumentList() {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [checked, setChecked] = React.useState<any[]>([]);
    const {instruments, selectedInstruments} = useSelector((state: RootState) => state.instrument);

    const handleToggle = (value: any) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = checked.length > 0 ? [...checked] : [];

        if (currentIndex === -1) {
            if (newChecked[0] === value)
                newChecked.splice(0, 1);
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        dispatch(setSelectedInstruments(newChecked))
    };

    useEffect(() => {
        if (selectedInstruments) {
            let newInstruments = [...selectedInstruments]
            setChecked(newInstruments)
        }
    }, [selectedInstruments])



    return (
        <List dense className={classes.root}>
            {instruments?.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (value && <ListItem key={uuidv4()} button>
                        <ListItemText id={labelId} primary={`Line item ${value.code}`}/>
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(value)}
                                checked={checked.map(c => c.code).indexOf(value.code) !== -1}
                                inputProps={{'aria-labelledby': labelId}}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
}