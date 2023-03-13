import { getAuth, signInWithPopup, GoogleAuthProvider, User, FacebookAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

export class SocialLogin {
    static initFirebase() {
        const configs = {
            apiKey: process.env['NEXT_PUBLIC_API_KEY'],
            authDomain: process.env['NEXT_PUBLIC_AUTH_DOMAIN'],
            projectId: process.env['NEXT_PUBLIC_PROJECT_ID'],
            storageBucket: process.env['NEXT_PUBLIC_STORAGE_BUCKET'],
            messagingSenderId: process.env['NEXT_PUBLIC_MESSAGING_SENDER_ID'],
            appId: process.env['NEXT_PUBLIC_APP_ID']
        }
        initializeApp(configs);
    }

    static async loginWithGoogle(): Promise<{
        token: string | undefined,
        user: User
    }> {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user
        return {
            token,
            user
        }
    }
    static async loginWithFacebook(): Promise<{
        token: string | undefined,
        user: User,
        photoUrl: string | undefined,
    }> {
        const provider = new FacebookAuthProvider();
        const auth = getAuth();
        const result = await signInWithPopup(auth, provider);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        const photoUrl = `${user?.photoURL}?height=500&access_token=${token}`;

        return {
            token,
            user,
            photoUrl
        }
    }
    static async logOut(): Promise<void> {
        const auth = getAuth();
        await signOut(auth)
    }
}