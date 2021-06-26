import {RestService} from "../RestService";
import {Firm, Fund, FundsTransferEntry, FundSummary, JournalEntry, TradeEntry} from "./models";

const {REACT_APP_API_URI_BOOKKEEPER} = process.env;

export class BookkeeperService extends RestService {

    get baseUrl(): string {
        return REACT_APP_API_URI_BOOKKEEPER ?? ""
    }

    public async getFirm(): Promise<Firm | null> {
        const response = await this.fetchData("firms");
        try {
            if (response.status === 200) {
                return response.data;
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    public async getFunds(): Promise<Fund[]> {
        const response = await this.fetchData("funds");
        return response.data;
    }

    public async getJournal(fundId: string): Promise<JournalEntry[]> {
        if (fundId === undefined) {
            const funds = await this.getFunds();
            fundId = funds[0].id;
        }

        const response = await this.fetchData(`funds/${fundId}/journal`);
        return response.data;
    }

    public async getTrades(fundId: string): Promise<TradeEntry[]> {
        const response = await this.fetchData(`funds/${fundId}/trades`);
        return response.data;
    }

    public async getTransfers(fundId: string): Promise<FundsTransferEntry[]> {
        const response = await this.fetchData(`funds/${fundId}/transfers`);
        return response.data;
    }

    public async getSummary(fundId: string): Promise<FundSummary> {
        const response = await this.fetchData(`funds/${fundId}/summary`);
        return response.data;
    }
}
