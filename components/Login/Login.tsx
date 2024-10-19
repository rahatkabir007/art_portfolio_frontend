import React, { useEffect } from 'react'
import styles from './Login.module.css';
import { SocialLogin } from '../Helpers/SocialLogin';
import { useActions } from '../../src/Overmind/OvermindHelper';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import { useRouter } from 'next/router';
import { CookiesHandler } from '../Helpers/CookiesHandler';
import { useSnackbar } from 'notistack';
// import Link from 'next/link';

interface Props {

}



const Login: React.FC<Props> = () => {
    const actions = useActions()
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        SocialLogin.initFirebase()
        enqueueSnackbar("For Better Experience, Use Mobile view !", { variant: 'success', autoHideDuration: 4000 })
    }, [])


    const handleGoogleLogin = async () => {
        actions.setDialogLoading(true)
        const { token, user } = await SocialLogin.loginWithGoogle()
        if (token && user?.email && user?.displayName && user?.photoURL) {
            const { email, displayName, photoURL } = user
            window.smartlook('identify', email);
            const { res, err } = await ArtPortfolioServer.login(token, email, displayName, photoURL, "google");
            if (err) {
                enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
                setTimeout(() => {
                    actions.setDialogLoading(false)
                }, 1000)
            }
            else {
                CookiesHandler.setAccessToken(res.access_token)
                if (res.slug) {
                    CookiesHandler.setSlug(res.slug as string)
                }
                actions.setSocialPicture(user?.photoURL)
                localStorage.clear();
                sessionStorage.clear();
                router.push(`/users/${res?.slug}`)
                setTimeout(() => {
                    actions.setDialogLoading(false)
                }, 1000)
                // Todo fix params
                enqueueSnackbar("Login successful !", { variant: 'success', autoHideDuration: 2000 })
            }
        }
    }

    // const handleFacebookLogin = async () => {
    //     actions.setDialogLoading(true)
    //     const { token, user, photoUrl } = await SocialLogin.loginWithFacebook()
    //     if (token && user?.email && user?.displayName && photoUrl) {
    //         const { email, displayName } = user
    //         const { res, err } = await ArtPortfolioServer.login(token, email, displayName, photoUrl, "facebook")
    //         if (err) {
    //             enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
    //             setTimeout(() => {
    //                 actions.setDialogLoading(false)
    //             }, 1000)
    //         }
    //         else {
    //             console.log('res', res)
    //             CookiesHandler.setAccessToken(res.access_token)
    //             if (res.slug) {
    //                 CookiesHandler.setSlug(res.slug as string)
    //             }
    //             actions.setSocialPicture(photoUrl)
    //             localStorage.clear();
    //             sessionStorage.clear();
    //             router.push(`/users/${res?.slug}`)
    //             setTimeout(() => {
    //                 actions.setDialogLoading(false)
    //             }, 1000)
    //             // Todo fix params
    //             enqueueSnackbar("Login successful !", { variant: 'success', autoHideDuration: 2000 })

    //         }

    //     }
    // }

    return <div className={styles['loginContainer']} >
        <div className={styles['title']}>
            <p>Art Portfolio</p>
        </div>
        <div className={styles['image']}>
            <picture>
                <img style={{ backgroundColor: '#e3e3e3', borderRadius: '20px' }} src='images/artPortfolio.png' alt="" />
            </picture>
        </div>

        <button className={styles['button']}
            onClick={handleGoogleLogin}>
            <picture>
                <img src='images/google.svg' alt="google"></img>
            </picture>
            <p> Login With Google</p>
        </button>
        {/* <button className={styles['button']}
            onClick={handleFacebookLogin}
        >
            <picture>
                <img src='images/facebook.svg' alt="facebook"></img>
            </picture>
            <p> Login With Facebook</p>
        </button> */}

        <div className={styles['privacy']}>
            {/* <p>By logging in, you agree to our terms <br /> and conditons and <span>Privacy Policy</span></p>
             */}
            {/* <p>This project is working on a Free Server as it is a Personal project. If you are logging in for the first time,</p>
            <p>Then Please login with Google and wait for one minute to start the server. Then Refresh and Login again! </p>
            <p>Thank You for your patience! 🧡</p> */}
        </div>

        {/* <Grid className={styles['bottomNav']}>
            <Link href="/checkout">Pricing</Link>
            <a href="">About</a>
            <a href="">Something</a>
            <a href="">Something</a>
        </Grid> */}
    </div>

}

export default Login;