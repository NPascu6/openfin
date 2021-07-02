import React, {useEffect, useState} from "react";
import {Divider, Grid} from "@material-ui/core";
import {fiatNumberFormatter} from "../../common/utils";

interface MarketTickerProps {
    message: any;
    instruments: any[]
}

const MarketTicker = ({message, instruments}: MarketTickerProps) => {
    const [currency, setCurrency] = useState<string>()
    const [price, setPrice] = useState<number>()

    useEffect(() => {
        if (!currency && message && message.currency) {
            setCurrency(message.currency)
        }
    }, [currency, message])

    useEffect(() => {
        if (message) {
            if (currency === message.currency && message.price > 0) {
                setPrice(message.price)
            }
        }
    }, [currency, price, message])

    return (
        <>
            {price ? <Grid item style={{display: 'flex', minWidth: '15em',  justifyContent: 'center', alignItems: 'center', backgroundColor: instruments?.map(i => i.code).filter(i => i === currency)[0] ? 'green' : 'red'}}>
                <p>{currency}</p>
                <p style={{marginLeft: '0.5em'}}>{fiatNumberFormatter.format(price)}</p>
            </Grid> : <div/>}
            {price && <Divider orientation="vertical" flexItem/>}
        </>

    )
}

export default React.memo(MarketTicker)