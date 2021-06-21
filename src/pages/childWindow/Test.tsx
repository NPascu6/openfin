import {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";

function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const Test = () => {
    const [number, setNumber] = useState(0)
    const {title} = useSelector((state: RootState) => state.app);


    useEffect(() => {
        const getNumber = () => {
            setNumber(randomIntFromInterval(0.0001, 43.000))
            console.log(number)
            setTimeout(getNumber,200)
        }

        if (!number)
            getNumber()
    }, [number])


    return (
            <Grid item>
                {title}
                {number}
            </Grid>
    )
}

export default Test