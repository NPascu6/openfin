import React, {useEffect, useState} from "react";
import {Divider, Grid} from "@material-ui/core";
import {fiatNumberFormatter} from "../../common/utils";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

interface MarketTickerProps {
    message: any;
}

const MarketTicker = ({message}: MarketTickerProps) => {
    const [currency, setCurrency] = useState<string>()
    const [price, setPrice] = useState<number>(0)
    const [priceIncreased, setPriceIncreased] = useState<boolean>(false)
    const [priceDecreased, setPriceDecreased] = useState<boolean>(false)
    const [open24, setOpen24] = useState<number>(0)

    useEffect(() => {
        if (!currency && message && message.currency && message.currency !== currency) {
            setCurrency(message.currency)
        }
    }, [currency, message])

    useEffect(() => {
        if (message) {
            if (message.open24 !== open24 && message.open24 > 0)
                setOpen24(message.open24)
        }

    }, [message, open24])

    useEffect(() => {
        if (message) {
            if (currency === message.currency && message.price > 0) {
                if (price === 0) {
                    setPrice(message.price)
                }
                if (price && price > 0) {
                        setPrice(message.price)

                    if (open24 < message.price && !priceIncreased && open24 !== message.open24) {
                        setPriceIncreased(!priceIncreased)
                        setPriceDecreased(!priceDecreased)
                    }
                    if (open24 > message.price && priceIncreased && open24 !== message.open24) {
                        setPriceDecreased(!priceDecreased)
                        setPriceIncreased(!priceIncreased)
                    }
                }
            }
        }
    }, [currency, price, message, open24, priceIncreased, priceDecreased])

    const getBackgroundColor = () => {
        return priceIncreased ? +(100 * ((price - open24) / open24)).toFixed(2) < 1 ?
            '#13DB4B33' : +(100 * ((price - open24) / open24)).toFixed(2) > 1 ?
                '#0c8238' : 'rgba(255, 9, 0, 0.3)' : 'rgba(255, 9, 0, 0.3)'
    }

    const getColor = () => {
        return priceIncreased ? +(100 * ((price - open24) / open24)).toFixed(2) < 1 ?
            '#00B10A' : +(100 * ((price - open24) / open24)).toFixed(2) > 1 ?
                '#00B10A' : '#FF0900' : '#FF0900'
    }

    const getPercentageDifference = () => {
        return (100 * ((price - open24) / open24)).toFixed(8)
    }

    return (
        <>
            {<Grid item style={{
                display: 'flex',
                minWidth: '20em',
                height: '2em',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: getBackgroundColor()
            }}>
                <p style={{color: '#FF9826'}}>{currency?.replace('-', ' / ')}</p>
                <p style={{marginLeft: '0.5em', color: '#FF9826'}}>{fiatNumberFormatter.format(price)}</p>
                {priceIncreased ? <ArrowDropUpIcon fontSize={"default"} style={{color: '#00B10A'}}/> :
                    <ArrowDropDownIcon fontSize={"default"} style={{color: '#FF0900'}}/>}
                <p style={{
                    marginLeft: '0.5em',
                    color: getColor()
                }}>{getPercentageDifference()}%</p>
            </Grid>
            }
            <Divider flexItem orientation={"vertical"}/>
        </>
    )
}

export default React.memo(MarketTicker)