import React, { useEffect } from 'react'
import { makeStyles } from '@mui/styles';
import { Fab, Grid } from "@mui/material";
// import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
import styles from './welcome.module.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import { Gtag } from '../../src/Others/Gtag';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
// import { ReactPixel } from 'react-facebook-pixel';
interface Props {

}

const useStyles = makeStyles(() => {
    return {
        // Define your styles here
        avatarSize: {
            width: '65px',
            height: '65px',
            color: 'white',
            backgroundColor: 'black',
            borderRadius: '50%',
            padding: '10px',
            marginTop: '10vh',
            "&:hover": {
                backgroundColor: 'black'
            }
        }
    }
});

const Welcome: React.FC<Props> = () => {
    // Hooks
    // const actions = useActions()
    // const states = useAppState()
    const classes = useStyles();
    const router = useRouter();

    // Funcs

    // Vars

    // JSX
    const callApi = async () => {
        const { res, err } = await ArtPortfolioServer.callWebsite();
        if (err) {
            console.log(err);
        }
        console.log(res)
    }
    useEffect(() => {
        callApi()
    }, [])

    return (
        <div className={styles['welcomeContainer']}  >
            <div className={styles['title']}>
                <p>Art Portfolio</p>
            </div>
            <div className={styles['image']}>
                <picture>
                    <img
                        onClick={() => {
                            Gtag.send("FAYAZ")
                            window.fbq('track', 'Lea', { currency: "USD", value: 30.00 })
                        }}
                        style={{ backgroundColor: '#e3e3e3', borderRadius: '20px' }} src='images/artPortfolio.png' alt="" />
                </picture>
            </div>



            <div className={styles['welcome']}
            // onClick={() => ReactPixel.track('abc', { currency: "USD", value: 30.00 })}
            >
                <p style={{ margin: '0 auto' }}>WELCOME</p>
            </div>
            <div className={styles['privacy']}>
                <p style={{ width: '75vw', margin: 'auto' }}> Discover the latest trends in design and
                    find the best result here.</p>
            </div>


            <div className={styles['buttonStyle']}>

                <Fab aria-label="add" classes={{ root: classes.avatarSize }} onClick={() => {
                    router.push('/login')
                    window.fbq('track', 'Lal', { currency: "USD", value: 30.00 })
                }}>
                    <ArrowForwardIcon className="buttonstyle" />
                </Fab>
            </div>

        </div>
    )

}


export default Welcome;
