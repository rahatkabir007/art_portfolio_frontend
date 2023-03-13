import React, { useEffect } from 'react'
import { Grid } from "@material-ui/core";
import styles from './Login.module.css';
import { SocialLogin } from '../Helpers/SocialLogin';
import { useActions } from '../../src/Overmind/OvermindHelper';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import { useRouter } from 'next/router';
import { CookiesHandler } from '../Helpers/CookiesHandler';
import { useSnackbar } from 'notistack';
import { DecryptCipher } from '../Helpers/DecryptCipher';
// import Link from 'next/link';

interface Props {

}



const Login: React.FC<Props> = () => {
    const actions = useActions()
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        SocialLogin.initFirebase()
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

    const handleFacebookLogin = async () => {
        actions.setDialogLoading(true)
        const { token, user, photoUrl } = await SocialLogin.loginWithFacebook()
        if (token && user?.email && user?.displayName && photoUrl) {
            const { email, displayName } = user
            const { res, err } = await ArtPortfolioServer.login(token, email, displayName, photoUrl, "facebook")
            if (err) {
                enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
                setTimeout(() => {
                    actions.setDialogLoading(false)
                }, 1000)
            }
            else {
                console.log('res', res)
                CookiesHandler.setAccessToken(res.access_token)
                if (res.slug) {
                    CookiesHandler.setSlug(res.slug as string)
                }
                actions.setSocialPicture(photoUrl)
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

    return <Grid className={styles['loginContainer']} container >
        <Grid className={styles['title']}>
            <p>Art Portfolio</p>
        </Grid>
        <Grid className={styles['image']}>
            <picture>
                <img style={{ backgroundColor: '#e3e3e3', borderRadius: '20px' }} src='images/artPortfolio.png' alt="" />
            </picture>
        </Grid>

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

        <Grid className={styles['privacy']}>
            <p>By logging in, you agree to our terms <br /> and conditons and <span>Privacy Policy</span></p>
        </Grid>

        {/* <Grid className={styles['bottomNav']}>
            <Link href="/checkout">Pricing</Link>
            <a href="">About</a>
            <a href="">Something</a>
            <a href="">Something</a>
        </Grid> */}
    </Grid>

}

export default Login;