import { CookiesHandler } from "../../components/Helpers/CookiesHandler"
import { IPortfolio, IUser, portfolioCreate, PSlugPagenumberObj, IUpdateImg } from "../../interfaces/dataInterface"

import { IGetOnePortfolioResponse, ILoginResponse, IndexAllPortfolioPortfolioResponse, IUserInfoResponse, IUserResponse } from "../../interfaces/responseInterface"
import { callFetch, MyFetchInterface } from "./CallFetch"
// const API_ENDPOINT = "https://art-portfolio-richit.herokuapp.com"
export const API_ENDPOINT = process.env['NEXT_PUBLIC_API_ENDPOINT']

export interface LoginInterface {
    status: number
    data: {
        access_token: string | null
    }
}

export class ArtPortfolioServer {

    static async callWebsite(): Promise<IndexAllPortfolioPortfolioResponse> {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}`, requestOptions)
    }

    static async login(token: string, email: string, fullName: string, avatar: string, tokenType: "google" | "facebook"): Promise<ILoginResponse> {
        console.log(token);
        console.log(API_ENDPOINT)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("token", token);
        urlencoded.append("tokenType", tokenType);
        urlencoded.append("email", email);
        urlencoded.append("fullName", fullName);
        urlencoded.append("avatar", avatar);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return await callFetch(`${API_ENDPOINT}/users/login`, requestOptions)

    }

    static async createPortfolio(portfolioCreate: portfolioCreate): Promise<MyFetchInterface> {
        const myHeaders = new Headers();
        console.log('lllllk', portfolioCreate)
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("name", portfolioCreate.name);
        urlencoded.append("description", portfolioCreate.description);
        // {
        //     none == false ? urlencoded.append("year", year) : urlencoded.append("year", '');
        // }
        urlencoded.append("pictures", portfolioCreate.picture);
        urlencoded.append("year", portfolioCreate.year);
        urlencoded.append("privacy", portfolioCreate.privacy);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio`, requestOptions)
    }

    static async getAllPortfoliosPaginated(slugPagenumberObject: PSlugPagenumberObj): Promise<IndexAllPortfolioPortfolioResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio?slug=${slugPagenumberObject.slug}&page=${slugPagenumberObject.pageNumber}`, requestOptions)
    }

    static async getAllPortfoliosPaginatedLimit(slugPagenumberObject: PSlugPagenumberObj): Promise<IndexAllPortfolioPortfolioResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio?slug=${slugPagenumberObject.slug}&page=${slugPagenumberObject.pageNumber}&limit=-1`, requestOptions)
    }
    static async getOnePortfolioPicPaginated(slugPagenumberObject: PSlugPagenumberObj): Promise<IGetOnePortfolioResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'GET',
            // headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio/${slugPagenumberObject.slug}?page=${slugPagenumberObject.pageNumber}`, requestOptions)
    }

    static async deleteOnePortfolio(portfolioid: string): Promise<MyFetchInterface> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio/${portfolioid}`, requestOptions)
    }

    static async getOnePortfolioDetails(portfolioid: string): Promise<IGetOnePortfolioResponse> {
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'GET',
            // headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio/${portfolioid}?limit=-1`, requestOptions)
    }

    // TODO: FIX
    // static async downloadLoadSinglePortfolioDetails(downloadPorfolioid): Promise<MyFetchInterface> {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         redirect: 'follow'
    //     };
    //     return await callFetch(`${API_ENDPOINT}/portfolio/${downloadPorfolioid}?limit=-1`, requestOptions)
    // }

    static async updateProfile(allProfileData: Partial<IUser>): Promise<IUserResponse> {
        console.log('DATAS', allProfileData)
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        if (allProfileData?.occupation) {
            urlencoded.append("occupation", allProfileData?.occupation);
        }
        if (allProfileData?.fullName) {
            urlencoded.append("fullName", allProfileData?.fullName);
        }
        if (allProfileData?.color) {
            urlencoded.append("color", allProfileData?.color);
        }
        if (allProfileData?.avatar) {
            urlencoded.append("avatar", allProfileData?.avatar);
        }
        if (allProfileData?.mainTitle) {
            urlencoded.append("mainTitle", allProfileData?.mainTitle);
        }
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return await callFetch(`${API_ENDPOINT}/users`, requestOptions)
    }


    static async updateOnePortfolio(onePortfolioData: Partial<IPortfolio>): Promise<MyFetchInterface> {
        console.log('lllll', onePortfolioData)
        // static async updateOnePortfolio(name, description, year, coverImage, pictures, editPortfolioid, style): Promise<MyFetchInterface> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        if (onePortfolioData?.name) {
            urlencoded.append("name", onePortfolioData?.name);
        }
        if (onePortfolioData?.description) {
            urlencoded.append("description", onePortfolioData?.description);
        }
        if (onePortfolioData?.year) {
            urlencoded.append("year", onePortfolioData?.year as string);
        }
        if (onePortfolioData?.coverImage) {
            urlencoded.append("coverImage", onePortfolioData?.coverImage.toString());
        }
        if (onePortfolioData?.pictures) {
            urlencoded.append('pictures', JSON.stringify(onePortfolioData?.pictures))
        }
        if (onePortfolioData?.style) {
            urlencoded.append('style', onePortfolioData?.style.toString())
        }
        if (onePortfolioData?.privacy) {
            urlencoded.append('privacy', onePortfolioData?.privacy)
        }
        // urlencoded.append("addedPictures", addedPictureJoinUrl)
        // urlencoded.append("deletedPictures", deletedPictureJoinUrl)
        // urlencoded.append("pictures", JSON.stringify(x.concat(editportfolioDetails.pictures)));
        // urlencoded.append("pictures",);
        // const body = { name, description, year: none == false ? year : '', pictures: x.concat(editportfolioDetails.pictures) }
        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return await callFetch(`${API_ENDPOINT}/portfolio/${onePortfolioData?.slug}`, requestOptions)
    }

    //update image details
    static async updateImageDetails(IUpdateImg: IUpdateImg): Promise<MyFetchInterface> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);

        const urlencoded = new URLSearchParams();
        urlencoded.append("name", IUpdateImg?.name);
        urlencoded.append("description", IUpdateImg?.description);
        urlencoded.append("url", IUpdateImg?.url);

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return await callFetch(`${API_ENDPOINT}/picture/${IUpdateImg.imageDetailsid}`, requestOptions)
    }

    static async getProfileData(portfolioUserSlug: string): Promise<IUserInfoResponse> {
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        console.log('slug from server file', portfolioUserSlug);
        const requestOptions = {
            method: 'GET',
            // headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/users/${portfolioUserSlug}`, requestOptions)

    }

    static async getUserInfo(): Promise<IUserInfoResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/users/profile`, requestOptions)

    }
    // static getImageDetails(imageDetailsid, callback: (result: any, error: any) => void) {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         redirect: 'follow'
    //     };
    //     //@ts-ignore
    //     fetch(`${API_ENDPOINT}/picture/${imageDetailsid}`, requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log('imageresult', result)
    //             callback(result, null)
    //         })
    //         .catch(error => {
    //             console.log('error', error)
    //             callback(null, error)
    //         });
    // }

    static async getPortfolioImages(slideShowPortfolioid: string): Promise<IGetOnePortfolioResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        return await callFetch(`${API_ENDPOINT}/portfolio/${slideShowPortfolioid}?limit=-1`, requestOptions)
    }


    // static async checkout(data): Promise<MyFetchInterface> {
    //     // var myHeaders = new Headers();
    //     // myHeaders.append("Authorization", `Bearer ${CookiesHandler.getAccessToken()}`);
    //     // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    //     const urlencoded = new URLSearchParams();
    //     urlencoded.append("price", data.price);

    //     const requestOptions = {
    //         method: 'POST',
    //         // headers: myHeaders,
    //         body: urlencoded,
    //         redirect: 'follow'
    //     };
    //     return await callFetch(`${API_ENDPOINT}/payments/checkout`, requestOptions)
    // }
}










