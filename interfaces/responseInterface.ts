import { IPortfolio, IUser } from "./dataInterface";
import { MyFetchInterface } from "../src/Others/CallFetch";

export interface IPortfolioWithPicLength extends IPortfolio {
    totalPictures: number
}

export interface IGetOnePortfolioResponse extends MyFetchInterface {
    res: IPortfolio
}

export interface IndexAllPortfolioPortfolioResponse extends MyFetchInterface {
    res: {
        arr: Array<IPortfolio>,
        userDetails: IUser,
        totalPortfolios: number
    }
}
export interface ILoginResponse extends MyFetchInterface {
    res: {
        slug: string
        access_token: string
        userId: string
    }
}

export interface IUserInfoResponse extends MyFetchInterface {
    res: {
        userDetails: IUser
        totalPortfolios: number
        totalPictures: number
    },
}

export interface IUserResponse extends MyFetchInterface {
    res: IUser
}