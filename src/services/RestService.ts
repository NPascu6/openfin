import axios, {AxiosResponse} from "axios";
import {AuthService} from "./auth/AuthService";

export abstract class RestService {

    abstract get baseUrl(): string;

    protected get authService(): AuthService | null {
        return AuthService.getInstance();
    };

    protected async fetchData(subPath: string, params: any = undefined): Promise<AxiosResponse> {
        const accessToken = await this.getToken();
        const path = `${this.baseUrl}/${subPath}`;
        try {
            return await axios.get(path, {
                params,
                headers: {
                    authorization: `Bearer ${accessToken}`,
                    accept: "application/json",
                },
            })
        } catch (err) {
            console.log(err.message)
            return err.message
        }
    }

    protected async postData(subPath: string, body: any = undefined): Promise<AxiosResponse> {
        const accessToken = await this.getToken();
        const path = `${this.baseUrl}/${subPath}`;
        const response = await axios.post(path, body, {
            headers: {
                authorization: 'Bearer ' + accessToken
            },
        });
        return response;
    }

    protected async putData(subPath: string, body: any = undefined): Promise<AxiosResponse> {
        const accessToken = await this.getToken();
        const path = `${this.baseUrl}/${subPath}`;
        const response = await axios.patch(path, body, {
            headers: {
                authorization: 'Bearer ' + accessToken
            },
        });
        return response;
    }

    private async getToken(): Promise<string | undefined> {
        try {
            let user: any;
            if (this.authService)
                user = await this.authService.getUser();

            return user.access_token;
        } catch (err) {

        }
    }
}