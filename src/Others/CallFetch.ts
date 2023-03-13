import { DecryptCipher } from "../../components/Helpers/DecryptCipher";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MyFetchInterface {
    res: any,
    err: any
}

export const callFetch = async (url: string, requestOptions: unknown): Promise<MyFetchInterface> => {
    return new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        fetch(url, requestOptions)
            .then(response => { return response.json() })
            .then((result) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const newResult = DecryptCipher.decrypt(result.ciphertext)
                console.log('newResult',newResult)
                if (result?.statusCode >= 400) {
                    resolve({
                        res: null,
                        err: result.message || 400
                    })
                }
                else {
                    resolve({
                        res: newResult,
                        err: null
                    })

                }
            })
            .catch(error => {
                // callback(null, error)
                resolve({
                    res: null,
                    err: error
                })
            });
    })
}

