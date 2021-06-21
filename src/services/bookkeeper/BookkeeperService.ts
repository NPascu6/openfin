import {RestService} from "../RestService";

const {REACT_APP_API_URI_BOOKKEEPER} = process.env;

export class BookkeeperService extends RestService {

    get baseUrl(): string {
        // @ts-ignore
        return REACT_APP_API_URI_BOOKKEEPER
    }

    public async getFirms(): Promise<any[]> {
        const response = await this.fetchData("admin/firms");
        try {
            return response.data;
        } catch (e) {
            console.log(e.message);
            return e.response.data
        }
    }

    public async getFunds(): Promise<any[]> {
        try {
            const response = await this.fetchData("funds");
            return response.data;
        } catch (err) {
            console.log(err.message);
            return err.response.data
        }
    }

    public async getTrades(fundId: string): Promise<any[]> {
        try {
            const response = await this.fetchData(`admin/funds/${fundId}/trades`);
            return response.data;
        } catch (err) {
            console.log(err.message);
            return err.response.data
        }
    }

    public async getAllTrades(): Promise<any[]> {
        try {
            const response = await this.fetchData(`admin/funds/trades`);
            return response.data;
        } catch (err) {
            console.log(err.message);
            return err.response.data
        }
    }

    public async getTransfers(fundId: string): Promise<any[]> {
        try {
            const response = await this.fetchData(`admin/funds/${fundId}/transfers`);
            return response.data;
        } catch (err) {
            console.log(err.message);
            return err.response.data
        }
    }

    public async getAllTransfers(): Promise<any[]> {
        try {
            const response = await this.fetchData(`admin/funds/transfers`);
            return response.data;
        } catch (err) {
            console.log(err.message);
            return err.response.data
        }
    }

    public async getSummary(fundId: string): Promise<any> {
        try {
            const response = await this.fetchData(`admin/funds/${fundId}/summary`);
            return response.data;
        } catch (err) {
            console.log(err.message);
            return err.response.data
        }
    }
}
