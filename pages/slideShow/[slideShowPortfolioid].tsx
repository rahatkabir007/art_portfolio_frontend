import React, { RefObject, useEffect, useRef, useState } from 'react'
import { Grid } from "@mui/material";
import styles from './slideShowPortfolio.module.css';
import { useActions } from '../../src/Overmind/OvermindHelper';
import { useRouter } from 'next/router';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from "next/image";
import { useSnackbar } from 'notistack';
import RepeatIcon from '@mui/icons-material/Repeat';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IPicture } from '../../interfaces/dataInterface';

interface Props {

}


const SlideShowPortfolioid: React.FC<Props> = () => {
    const actions = useActions()
    // const states = useAppState()
    const router = useRouter();
    const { slideShowPortfolioid } = router.query;
    const [slideShowPictures, setSlideShowPictures] = useState<Array<IPicture>>([])
    const { enqueueSnackbar } = useSnackbar();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerOpenReload, setDrawerOpenReload] = useState(true)
    const [time, setTime] = useState(0);
    const [info, setInfo] = useState(true);
    const [repeat, setRepeat] = useState(true);
    const [restImg, setRestImg] = useState(0);



    const getPortfolioPics = async (slideShowPortfolioid: string) => {
        const { res, err } = await ArtPortfolioServer.getPortfolioImages(slideShowPortfolioid)
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            setSlideShowPictures(res.pictures)
            setRestImg(res.pictures.length)
            actions.setUserColor(res.color);
        }
    }


    const transitionTime = [2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15
    ];


    //eta repeat er function
    const handleRepeat = () => {
        setRepeat(!repeat);
        // if (!repeat) {
        //     setRepeat(true);
        // }
    }


    const handleInfo = () => {
        setInfo(!info);
    }

    const ref = useRef() as RefObject<Splide>
    useEffect(() => {
        const interval = setInterval(() => {
            ref?.current?.splide?.go('>');

        }, transitionTime[time] * 1100);
        const back = setTimeout(() => {
            if (!repeat && restImg == 1) {
                console.log('hello')
                router.back()
            }
        }, transitionTime[time] * 1100);
        return () => {
            clearInterval(interval)
            clearInterval(back)
        }
    }, [time, restImg, repeat]);

    useEffect(() => {

        if (slideShowPortfolioid) {
            getPortfolioPics(slideShowPortfolioid.toString())
        }
    }, [slideShowPortfolioid])

    return <>

        {slideShowPictures.length > 0 && (
            <div
                className={styles['container']}
            >

                <div>

                    <div className={styles['bg']}
                        onClick={() => {
                            setDrawerOpen(!drawerOpen)
                            setDrawerOpenReload(false)
                        }}
                    >
                        {/* slide choltese eta diye */}
                        <Splide
                            ref={ref}
                            options={{
                                perPage: 1,
                                perMove: 1,
                                type: 'fade',
                                rewind: repeat ? true : false,
                                gap: '1rem',
                                resetProgress: true,
                                arrows: false,
                                pagination: false,
                                trimSpace: false,
                                interval: transitionTime[time] * 1000,
                                fixedHeight: '100vh',

                            }}
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onMove={(_sss, iii, _ppp, _dddd) => {
                                const restImgg = (slideShowPictures.length - iii)
                                setRestImg(restImgg)
                            }}

                            className={styles['sliderContainer']}
                        >

                            {
                                slideShowPictures.map((sliderImg) => {
                                    return (
                                        <SplideSlide
                                            key={sliderImg._id}
                                            className={styles['imageContainer']}
                                        >
                                            <Image
                                                style={{ backgroundColor: 'rgba(0,0,0,0.6)', minHeight: '100%' }}
                                                src={sliderImg.url}
                                                alt='Avatar'
                                                layout='fill'
                                                objectFit='contain'
                                            />

                                            <div style={info ? { display: 'block' } : { display: 'none' }} className={styles['imageDetails']} >
                                                <p style={{ color: 'white', fontSize: '25px', fontFamily: 'Bebas Neue', margin: '0 1rem' }}>{sliderImg.name ? sliderImg.name : ''}</p>
                                                <p style={{ color: 'white', fontSize: '15px', fontFamily: 'Poppins', margin: '0 1rem 0.5rem' }}>{sliderImg.description ? sliderImg.description : ''}</p>
                                            </div>
                                        </SplideSlide >
                                    )
                                })
                            }

                        </Splide>

                    </div >

                </div >



                {
                    drawerOpen ?

                        <div className={styles['topDrawerGrow']}>
                            <div>
                                <ArrowBackIcon style={{ fontSize: '40px', paddingLeft: '16px', marginTop: '16px' }} onClick={() => { router.back(); }} />
                            </div>
                        </div>
                        :
                        <div className={drawerOpenReload ? styles['topDrawer'] : styles['topDrawerSqueeze']}>
                            <div>
                                <ArrowBackIcon style={{ fontSize: '40px', paddingLeft: '16px', marginTop: '16px' }} />
                            </div>
                        </div>

                }

                {/* drawer open hocche ekhane */}

                {drawerOpen ?

                    <div className={styles['rightDrawerGrow']}>
                        <div className={styles['iconContainer']}>
                            <div onClick={() => { handleRepeat() }}><RepeatIcon style={repeat ? { fontSize: '40px', cursor: 'pointer' } : { fontSize: '40px', cursor: 'pointer', color: 'grey' }} /></div>
                            <p>Repeat</p>
                        </div>



                        <div className={styles['iconContainer']}>
                            <div onClick={handleInfo}><InfoIcon style={info ? { fontSize: '40px', cursor: 'pointer' } : { fontSize: '40px', cursor: 'pointer', color: 'grey' }} /></div>
                            <p>Info</p>
                        </div>
                        <div className={`${styles['iconContainer']} ${styles['transitionContainer']}`}>
                            <Splide
                                options={{
                                    perPage: 3,
                                    perMove: 1,
                                    focus: 'center',
                                    arrows: false,
                                    pagination: false,
                                    gap: '0.3rem',
                                    trimSpace: false,
                                    isNavigation: true,

                                }}
                                onMove={(e) => {
                                    setTime(e.index);
                                }}

                                className={styles['timeContainer']}
                            >
                                {
                                    transitionTime.map((timeNumber, index) => {
                                        return (
                                            <SplideSlide
                                                key={timeNumber}
                                                className={styles['timeInput']}
                                            >
                                                {
                                                    time === index ? <p className={styles['selectedButton']}>{timeNumber}</p> : <p className={styles['notSelectedButton']}>{timeNumber}</p>
                                                }
                                            </SplideSlide>
                                        )
                                    })
                                }
                            </Splide>
                            <div >
                                <p>Transition Time</p>
                            </div>
                        </div>

                    </div>
                    :
                    <div className={drawerOpenReload ? styles['rightDrawer'] : styles['rightDrawerSqueeze']}>
                        <div className={styles['iconContainer']}>
                            <RepeatIcon style={{ fontSize: '40px' }} />
                            <p>Repeat</p>
                        </div>

                        <div className={styles['iconContainer']}>
                            <InfoIcon style={{ fontSize: '40px' }} />
                            <p>Info</p>
                        </div>
                        <div className={`${styles['iconContainer']} ${styles['transitionContainer']}`}>
                            <Splide
                                options={{
                                    perPage: 3,
                                    perMove: 1,
                                    focus: 'center',
                                    arrows: false,
                                    pagination: false,
                                    gap: '0.3rem',
                                    trimSpace: false,
                                    isNavigation: true,
                                    preloadPages: 1
                                }}
                                onMove={(e) => {
                                    setTime(e.index);
                                }}
                                className={styles['timeContainer']}
                            >
                                {
                                    transitionTime.map((timeNumber) => {
                                        return (
                                            <SplideSlide
                                                key={timeNumber}
                                                className={styles['timeInput']}
                                            >
                                                <p style={{ marginBottom: '0', marginTop: '0' }}>{timeNumber}</p>
                                            </SplideSlide>
                                        )
                                    })
                                }
                            </Splide>
                            <div >
                                <p>Transition Time</p>
                            </div>
                        </div>
                    </div>

                }
            </div>
        )}

    </>

}

export default SlideShowPortfolioid;