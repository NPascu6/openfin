import {useState} from "react";
import {Grid} from "@material-ui/core";
import {useDebounce} from "react-use";
import OtcService from "../../services/otc/OtcService";

function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const Ticker = () => {
    const [number, setNumber] = useState(0)

    const getNumber = () => {
        if(!number){
            setNumber(randomIntFromInterval(0.0001, 43.000))
        }

        setTimeout(getNumber,100)
    }

    const [,] = useDebounce(
        () => {
            if (!number) {
                console.log(number)
                getNumber()
                debugger
                OtcService.start()
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