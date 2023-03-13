import axios, { AxiosResponse } from 'axios';
const IMGBB_API_ENDPOINT = "https://api.imgbb.com/1/upload"
export interface AxiosReturnType {
    err: {
        error: number
    } | null;
    res: AxiosResponse | null;
}

export class ArtPortfolioOtherApiServer {

    static async uploadOneImageToImgbb(file: File,
        // callback: (res: string | null, error: any) => void
    ): Promise<AxiosReturnType> {
        const imgData = new FormData()
        const aaaa = process.env['NEXT_PUBLIC_IMGBB_KEY']?.toString() ?? ""
        imgData.set("key", aaaa)
        imgData.append("image", file)
        return new Promise((resolve) => {
            axios.post(IMGBB_API_ENDPOINT, imgData)
                .then((res) => {
                    if (res.status >= 400) {
                        resolve({
                            err: {
                                error: 999,
                            },
                            res: res,
                        });
                    } else {
                        resolve({
                            err: null,
                            res: res,
                        });
                    }
                })
                .catch((err) => {
                    resolve({
                        err: err,
                        res: null,
                    });
                });
        })
    }


    // static async updateMainTitle(name:string, description: string,url: string, setOpen: any, imageDetailsid: string, setPictureDetail: any) {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", `Bearer ${CookiesHandler.getCookies()}`);

    //     var urlencoded = new URLSearchParams();
    //     urlencoded.append("name", name);
    //     urlencoded.append("description", description);
    //     urlencoded.append("url", url);

    //     var requestOptions = {
    //         method: 'PUT',
    //         headers: myHeaders,
    //         body: urlencoded,
    //         redirect: 'follow'
    //     };

    //     //@ts-ignore
    //     fetch(`${API_ENDPOINT}picture/${pictureDetail._id}`, requestOptions)
    //         .then(response => response.text())
    //         .then(result => {
    //             console.log('hello', result)
    //             setOpen(false);
    //             ArtPortfolioServer.imageDetails(imageDetailsid, (result, error) => {
    //                 console.log('hello', result)
    //                 setPictureDetail(result)
    //             })

    //         }
    //         )
    //         .catch(error => {
    //             console.log('error', error)
    //         }
    //         );
    // }



}