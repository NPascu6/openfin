import {User} from "oidc-client";
import {AppDispatch, AppThunk} from "../../redux/store";
import {setIsAppReady, setUserProfile} from "../../redux/slices/app/appSlice";
import {setOtcCurrentQuote, setOtcOrderStatus} from "../../redux/slices/otc/otcSlice";
import AuthService from "../auth/AuthService";
import OtcService from "../otc/OtcService";

export const initApp = (): AppThunk => async (dispatch: AppDispatch) => {

    await initAuthService(dispatch);
};

const dispatchAppProps = async (dispatch: AppDispatch, user: User) => {
    dispatch(setUserProfile(user.profile));

    await OtcService.registerUser(user);

    OtcService.quoteUpdate.subscribe(quote => {
        dispatch(setOtcCurrentQuote(quote));
    });

    OtcService.orderStatusUpdate.subscribe(orderStatus => {
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
        await OtcService.registerUser(user);
    })

    try {
        let user = await authService.getUser();

        if (user && !user.expired) {
            await dispatchAppProps(dispatch, user);
        } else {
            try {
                const user = await authService.iframeSignin();
                await dispatchAppProps(dispatch, user);
                debugger
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
            }
        }
    } catch (err) {
        console.error(err);
        dispatch(setIsAppReady(true));
    }
};


