import {useState} from "react";
import {Grid} from "@material-ui/core";
import {useDebounce} from "react-use";

function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

interface TickerProps {
    setLocalTicker: (number: number) => any
}

const Ticker = ({setLocalTicker} : TickerProps) => {
    const [number, setNumber] = useState(0)

    const getNumber = () => {
        if (!number) {
            let random = randomIntFromInterval(0.0001, 43.000)
            setNumber(random)
            setLocalTicker(number)
        }

        setTimeout(getNumber, 2000)
    }

    const [,] = useDebounce(
        () => {
            if (!number) {
                console.log(number)
                getNumber()
            }
        },
        1500,
        [number]
    );


    return (
        <Grid item>
            {number}
        </Grid>
    )
}

export default Ticker