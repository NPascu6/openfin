import {useState} from "react";
import {Grid} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {useDebounce} from "react-use";

function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}



const Test = () => {
    const [number, setNumber] = useState(0)
    const {title} = useSelector((state: RootState) => state.app);

    const getNumber = () => {
        if(!number){
            setNumber(randomIntFromInterval(0.0001, 43.000))

        }

        setTimeout(getNumber,3000)
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
                {title}
                {number}
            </Grid>
    )
}

export default Test