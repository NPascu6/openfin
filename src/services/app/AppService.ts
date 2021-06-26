import {User} from "oidc-client";
import {AppDispatch, AppThunk} from "../../redux/store";
import {setIsAppReady, setUserProfile} from "../../redux/slices/app/appSlice";
import AuthService from "../auth/AuthService";
import MarketDataService from "../marketdata/MarketDataService";
import OtcService from "../otc/OtcService";
import {fetchCurrencies} from "../../redux/thunks/instrument";
import {fetchFirm} from "../../redux/thunks/bookkeeper";
import {setOtcCurrentQuote, setOtcOrderStatus} from "../../redux/slices/otc/otc";
import {OtcOrderStatusEntry} from "../otc/models";
import {setTickerMessages} from "../../redux/slices/marketdata/marketdata";

export const initApp = (): AppThunk => async (dispatch: AppDispatch) => {
    await initAuthService(dispatch);
};

const dispatchAppProps = async (dispatch: AppDispatch, user: User) => {
    dispatch(setUserProfile(user.profile));

    await MarketDataService.registerUser(user);
    await OtcService.registerUser(user);

    const currencies = await fetchCurrencies();
    await dispatch(currencies);

    const firm = await fetchFirm();
    await dispatch(firm);
    await MarketDataService.start();


    MarketDataService.tickerUpdate.subscribe((tickers) => {
        dispatch(setTickerMessages(tickers));
    });


    OtcService.quoteUpdate.subscribe((quote: any) => {
        dispatch(setOtcCurrentQuote(quote));
    });

    OtcService.orderStatusUpdate.subscribe((orderStatus: OtcOrderStatusEntry) => {
        dispatch(setOtcOrderStatus(orderStatus));
    });



    dispatch(setIsAppReady(true));
}

const initAuthService = async (dispatch: AppDispatch) => {
    const authService = AuthService;
    const authServiceEvents = authService.userManager.events;

    authServiceEvents.addUserSignedOut(async () => {
        await AuthService.startSigninMainWindow();
    });

    authServiceEvents.addUserLoaded(async user => {
        await MarketDataService.registerUser(user);
    })

    try {
        let user = await authService.getUser();

        if (user && !user.expired) {
            await dispatchAppProps(dispatch, user);
        } else {
            try {
                const user = await authService.iframeSignin();
                await dispatchAppProps(dispatch, user);
            } catch (err) {
                if (err.session_state) {
                    if (err.message === "login_required" ||
                        err.message === "consent_required" ||
                        err.message === "interaction_required" ||
                        err.message === "account_selection_required"
                    ) {
                        return await authService.startSigninMainWindow();
                    }
                }
                throw err;
            }
        }
    } catch (err) {
        console.error(err);
        dispatch(setIsAppReady(true));
    }
};

