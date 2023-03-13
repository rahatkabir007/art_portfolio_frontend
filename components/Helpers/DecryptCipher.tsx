/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// const CryptoJS = require("crypto-js");
import * as CryptoJS from "crypto-js";

export class DecryptCipher {
  static decrypt(data: string) {
    console.log("Beforedecrypt", data);
    const bytes = CryptoJS.AES.decrypt(data, "secret key 123"); 
    const obj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("decryptedData", obj);
    return obj;
  }
}
