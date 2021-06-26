import {OtcLockQuoteRequest, OtcOrderSide, OtcOrderValidation} from "../services/otc/models";

export const validateCurrentBalance = (otcLockRequest: OtcLockQuoteRequest): OtcOrderValidation => {
    const {instrument} = otcLockRequest;
    const totalBalances = otcLockRequest.totalBalances;
    const {orderCurrency, baseCurrency, quoteCurrency, quantity, buy, sell} = otcLockRequest.lockedQuote;

    const validation: OtcOrderValidation = {
        side: otcLockRequest.side,
        isValid: true,
        message: "Insufficient funds"
    }

    if (otcLockRequest.lockedQuote) {
        if (otcLockRequest.side === OtcOrderSide.None) {
            validation.isValid = false;
            validation.message = "Invalid operation";
            return validation;
        }

        // @ts-ignore
        let base = totalBalances ? totalBalances[baseCurrency.toLowerCase()] : null
        // @ts-ignore
        let quote = totalBalances ? totalBalances[quoteCurrency.toLowerCase()] : null

        const balance = otcLockRequest.side === OtcOrderSide.Sell ? base : quote;

        let maxQuantity: number | undefined = 0, orderSize: number | undefined = 0;
        if (!balance) {
            validation.isValid = false;
            return validation;
        } else if (otcLockRequest.side === OtcOrderSide.Sell) {
            if (orderCurrency === baseCurrency) {
                maxQuantity = quantity;
                orderSize = quantity;
            } else if (orderCurrency === quoteCurrency && quantity) {
                maxQuantity = quantity / sell;
                orderSize = quantity / sell;
            }
        } else if (otcLockRequest.side === OtcOrderSide.Buy) {
            if (orderCurrency === baseCurrency && quantity) {
                maxQuantity = buy * quantity;
                orderSize = quantity;
            } else if (orderCurrency === quoteCurrency && quantity) {
                maxQuantity = quantity;
                orderSize = quantity / buy;
            }
        }

        if (maxQuantity && maxQuantity > +balance) {
            validation.isValid = false;
            return validation;
        }

        if (orderSize && orderSize < +instrument.minimumSize) {
            validation.isValid = false;
            validation.message = `Less than minimum order size: ${instrument.minimumSize} ${baseCurrency}`
        }
    }

    return validation;
};