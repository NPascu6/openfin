import {SessionStatus, SignoutResponse, User, UserManager, UserManagerSettings} from "oidc-client";

const {
    REACT_APP_BASE_URI,
    REACT_APP_AUTH_URL,
    REACT_APP_AUTH_CLIENT,
    REACT_APP_AUTH_SCOPE,
    REACT_APP_STAGE
} = process.env;

export class AuthService {
    private static instance: AuthService;
    private _state = {state: "portal"};
    private readonly _userManager: UserManager;
    private _config: UserManagerSettings = {
        authority: REACT_APP_AUTH_URL,
        client_id: REACT_APP_AUTH_CLIENT,
        redirect_uri: `${REACT_APP_BASE_URI}/signin-oidc.html`,
        silent_redirect_uri: `${REACT_APP_BASE_URI}/signin-oidc.html`,
        post_logout_redirect_uri: `${REACT_APP_BASE_URI}/signin-oidc.html`,
        // Number of seconds before the token expires to trigger the `tokenExpiring` event
        accessTokenExpiringNotificationTime: 10,
        response_type: "code",
        scope: REACT_APP_AUTH_SCOPE,
        revokeAccessTokenOnSignout: true,
        automaticSilentRenew: true,
        loadUserInfo: true,
        // Do we want to filter OIDC protocol-specific claims from the response?
        filterProtocolClaims: true
    };

    private constructor() {
        this._userManager = new UserManager(this._config);
        this.initEvents();
    }

    public get userManager(): UserManager {
        return this._userManager;
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    ///////////////////////////////
    public async clearState(): Promise<void> {
        return this._userManager.clearStaleState();
    }

    ///////////////////////////////
    // functions for UI elements

    public async getUser(): Promise<User | null> {
        return this._userManager.getUser();
    }

    public async removeUser(): Promise<void> {
        return this._userManager.removeUser();
    }

    public async startSigninMainWindow(): Promise<void> {
        return this._userManager.signinRedirect(this._state);
    }

    public async endSigninMainWindow(): Promise<User> {
        return this._userManager.signinRedirectCallback();
    }

    public async startSigninMainWindowDiffCallbackPage(): Promise<void> {
        const arg = {
            state: "portal",
            redirect_uri: `${REACT_APP_BASE_URI}/signin-oidc.html`,
        };
        return await this._userManager.signinRedirect(arg);
    }

    public async popupSignin(): Promise<User> {
        return this._userManager.signinPopup(this._state);
    }

    public async popupSignout(): Promise<void> {
        return this._userManager.signoutPopup(this._state);
    }

    public async iframeSignin(): Promise<User> {
        return this._userManager.signinSilent(this._state);
    }

    public async querySessionStatus(): Promise<SessionStatus> {
        return this._userManager.querySessionStatus();
    }

    public async startSignoutMainWindow(): Promise<void> {
        return this._userManager.signoutRedirect(this._state);
    }

    public async endSignoutMainWindow(): Promise<SignoutResponse> {
        return this._userManager.signoutRedirectCallback();
    }

    private initEvents() {
        this._userManager.events.addAccessTokenExpiring(() => {
            console.log("user", "expiring", "token expiring", 1);
        });

        this._userManager.events.addAccessTokenExpired(() => {
            console.log("user", "expired", "token expired", 1);
        });

        this._userManager.events.addSilentRenewError((e) => {
            console.log(e.message);
        });

        this._userManager.events.addUserLoaded((user: User) => {
            if (REACT_APP_STAGE === "development")
                console.log("user loaded", user);
            console.log("user", "loaded", "user loaded", 1);
        });

        this._userManager.events.addUserUnloaded(() => {
            console.log("user", "unloaded", "user unloaded", 1);
        });

        this._userManager.events.addUserSignedOut(async () => {
            await this._userManager.removeUser();
        });
    }
}

export default AuthService.getInstance();
