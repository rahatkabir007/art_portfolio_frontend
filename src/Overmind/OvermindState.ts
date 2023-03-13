import { IPortfolio, IUser } from "../../interfaces/dataInterface"

export interface State {
    counter: number,
    selectedFiles: Array<File>,
    selectedFileUrls: Array<string>,
    img: string,
    styleDrawer: boolean,
    rejectedFiles: number,
    position: number,
    dialogLoading: boolean,
    userInfo: IUser | null,
    socialPicture: string | null,
    mainTitle: string | null,
    totalPortfolioNumber: number,
    pictureNumber: number,
    countPortfolioPage: number,
    portfolioDetailsWithImages: IPortfolio | null,
    // imageCurrentIndex: number,
    coverImagesArray: Array<number>,
    initialStylePortfolioNumber: number | null,
    stylePortfolioNumber: number | null,
    privacy: string,
    color: string
}

export const state: State = {
    counter: 0,
    selectedFiles: [],
    selectedFileUrls: [],
    img: '',
    styleDrawer: false,
    rejectedFiles: 0,
    dialogLoading: false,
    position: 0,
    userInfo: null,
    socialPicture: null,
    mainTitle: null,
    totalPortfolioNumber: 0,
    pictureNumber: 0,
    countPortfolioPage: 1,
    portfolioDetailsWithImages: null,
    // imageCurrentIndex:0,
    coverImagesArray: [],
    initialStylePortfolioNumber: null,
    stylePortfolioNumber: null,
    privacy: '',
    color: '',


}
