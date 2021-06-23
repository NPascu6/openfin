import {User} from "oidc-client";
import {AppDispatch, AppThunk} from "../../redux/store";
import {setIsAppReady, setUserProfile, setUser} from "../../redux/slices/app/appSlice";
import AuthService from "../auth/AuthService";

export const initApp = (): AppThunk => async (dispatch: AppDispatch) => {
    await initAuthService(dispatch);
};

const dispatchAppProps = async (dispatch: AppDispatch, user: User) => {
    dispatch(setUserProfile(user.profile));
    dispatch(setUser(user))
    dispatch(setIsAppReady(true));
}

const initAuthService = async (dispatch: AppDispatch) => {
    const authService = AuthService;
    const authServiceEvents = authService.userManager.events;

    authServiceEvents.addUserSignedOut(async () => {
        await AuthService.startSigninMainWindow();
    });

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
            }
        }
    } catch (err) {
        console.error(err);
        dispatch(setIsAppReady(false));
    }
};


