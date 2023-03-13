import React, { useEffect, useState } from 'react'
import { Grid } from "@material-ui/core";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import styles from './styles.module.css';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useRouter } from 'next/router';
import { ArtPortfolioServer } from '../../../../src/Others/ArtPortfolioServer';
import { useActions, useAppState } from '../../../../src/Overmind/OvermindHelper';
import EditPictureDetailsDialog from '../../../../components/Helpers/EditPictureDetailsDialog/EditPictureDetailsDialog';
import { useSnackbar } from 'notistack';
import { Skeleton } from '@material-ui/lab';
import { CookiesHandler } from '../../../../components/Helpers/CookiesHandler';



interface Props {

}


const Index: React.FC<Props> = () => {
    // Hooks
    const actions = useActions();
    const states = useAppState();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const router = useRouter();
    const [swipeDrawerOpen, setswipeDrawerOpen] = useState(false)
    const [drawerOpenReload, setDrawerOpenReload] = useState(true)
    const [dnr, setDnr] = useState(false);
    const [dnr2, setDnr2] = useState(false);
    const [dnr3, setDnr3] = useState(false);
    const [title, setTitle] = useState(false);
    // const [imageDetailsid, setImageDetailsid] = useState();
    // const [stateChange, setStateChange] = useState(false)
    const { portfolioid, imageIndex } = router.query;
    const [open, setOpen] = React.useState(false);
    const [currentIndex, setCurrentIndex] = useState(0)

    const { enqueueSnackbar } = useSnackbar();
    const loggedinSlug = CookiesHandler.getSlug();


    const fetchOnePortfolioDetail = async () => {
        if (!portfolioid) {
            return
        }
        const { res, err } = await ArtPortfolioServer.getOnePortfolioDetails(portfolioid.toString())
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            console.log('res', res)
            actions.setPortfolioDetailsWithImages(res)
            actions.setUserColor(res?.color)
        }
    }

    useEffect(() => {
        console.log('img', imageIndex)
        if (portfolioid && imageIndex) {
            fetchOnePortfolioDetail()
            setCurrentIndex(parseInt(imageIndex.toString()))
        }

    }, [portfolioid])



    // Funcs
    const getBottomStyle = () => {
        // drawerOpenReload ? styles.downDrawer : styles.downDrawerGrow
        if (drawerOpenReload) {
            if (swipeDrawerOpen) {
                return styles['downDrawerGrowMore']
            }
            if (!dnr && !swipeDrawerOpen) {
                return styles['downDrawer']
            }
            // else {
            return styles['downDrawerGrowtoDown']
            // }
        }
        if (!drawerOpenReload) {
            if (swipeDrawerOpen && dnr) {
                return styles['downDrawerGrowMore']
            }

            if (dnr && !dnr2 && !swipeDrawerOpen) {
                return styles['downDrawerGrowtoDown']
            }

            if (!dnr && !dnr2 && dnr3 && swipeDrawerOpen) {
                return styles['downDrawerGrowToLast']
            }
            return styles['downDrawerGrow']

        }
        return ""
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const imgIndex = () => {
        if (!imageIndex) {
            return
        }
        return parseInt(imageIndex.toString())
    }

    // const portfolioUpdate = (res) => {
    //     console.log('fetching response',res)
    //     setPortfolioDetails(res)
    // }



    // Vars

    // JSX

    return (
        <Grid>
            {states.portfolioDetailsWithImages ? (
                <Grid>
                    <EditPictureDetailsDialog
                        open={open}
                        setOpen={setOpen}
                        currentIndex={currentIndex}
                    />

                    <Grid>
                        <Grid className={styles['bg']} onClick={() => {
                            setDrawerOpen(!drawerOpen)
                            setDrawerOpenReload(false)
                            setDnr2(!dnr2)
                            setDnr(false)
                        }}>

                            <Splide
                                options={{
                                    perPage: 1,
                                    perMove: 1,
                                    type: 'fade',
                                    rewind: false,
                                    gap: '1rem',
                                    autoplay: false,
                                    resetProgress: true,
                                    arrows: false,
                                    pagination: false,
                                    trimSpace: false,
                                    interval: 2000,
                                    fixedHeight: '100vh',
                                    start: imgIndex()
                                }}

                                onMove={(_eee, _iii, _ppp, ddd) => {
                                    setTitle(true)
                                    setTimeout(() => {
                                        setTitle(false)
                                    }, 300)
                                    setCurrentIndex(ddd)
                                }}

                                className={styles['containerR']}
                            >

                                {
                                    states.portfolioDetailsWithImages?.pictures?.map(img => {
                                        return (

                                            <SplideSlide
                                                key={img._id}
                                            >
                                                <picture>
                                                    <img
                                                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', objectFit: 'contain', height: '100%', width: '100%' }}
                                                        src={img?.url}
                                                        alt='Avatar'
                                                    />
                                                </picture>
                                            </SplideSlide>
                                        )
                                    })
                                }
                            </Splide>
                        </Grid>

                    </Grid>

                    {drawerOpen ?

                        < Grid className={drawerOpenReload ? styles['topDrawer'] : styles['topDrawerGrow']}>
                            <Grid>
                                <ArrowBackIcon style={{ fontSize: '40px', paddingLeft: '5px', paddingTop: '4px' }} onClick={() => { router.back() }} />
                            </Grid>
                            {
                                states.portfolioDetailsWithImages?.userSlug !== loggedinSlug ? '' : <Grid>
                                    <EditIcon style={{ fontSize: '35px', color: 'white', paddingRight: '8px', paddingTop: '6px' }} onClick={handleClickOpen} />
                                </Grid>
                            }

                        </Grid>
                        :
                        < Grid className={styles['topDrawerSqueeze']}>
                            <Grid>
                                <ArrowBackIcon style={{ fontSize: '40px', paddingLeft: '5px', paddingTop: '4px' }} />
                            </Grid>
                            {
                                states.portfolioDetailsWithImages?.userSlug !== loggedinSlug ? '' : <Grid>
                                    <EditIcon style={{ fontSize: '35px', color: 'white', paddingRight: '8px', paddingTop: '6px' }} onClick={handleClickOpen} />
                                </Grid>
                            }
                        </Grid>

                    }
                    {drawerOpen ?

                        // < Grid className={drawerOpenReload ? styles.downDrawer : styles.downDrawerGrow}>
                        < Grid className={getBottomStyle()} onClick={() => {
                            setswipeDrawerOpen(!swipeDrawerOpen)
                            setDnr(true)
                            setDnr3(!dnr3)
                        }} >
                            <Grid style={{ width: '4vw', margin: 'auto', textAlign: 'center', borderRadius: '10px', height: '5px', backgroundColor: 'white', marginTop: '15px' }}>
                            </Grid>
                            <Grid style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Bebas Neue', color: 'white', textTransform: 'uppercase', marginLeft: '3vw' }}>
                                {/* <Grid className={title ?`${styles.animate_animated} ${styles.animate_flipInX}`:''}> */}
                                <Grid className={title ? "animate__animated animate__flipInX" : ''}>
                                    <Grid style={{ fontSize: '40px', marginTop: '5px', whiteSpace: 'nowrap', width: '95vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{states.portfolioDetailsWithImages.pictures[currentIndex]?.name ? states.portfolioDetailsWithImages.pictures[currentIndex]?.name : 'NO TITLE'}</Grid>
                                </Grid>
                                <Grid style={{ fontSize: '16px', whiteSpace: 'nowrap', width: '95vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{states.portfolioDetailsWithImages.pictures[currentIndex]?.description ? states.portfolioDetailsWithImages.pictures[currentIndex]?.description : ''}</Grid>
                            </Grid>
                        </Grid>
                        :

                        <Grid className={styles['downDrawerSqueeze']} >
                            <Grid style={{ width: '4vw', margin: 'auto', textAlign: 'center', borderRadius: '10px', height: '5px', backgroundColor: 'white', marginTop: '15px' }}>
                            </Grid>
                            <Grid style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Bebas Neue', color: 'white', textTransform: 'uppercase', marginLeft: '3vw' }}>
                                <Grid style={{ fontSize: '40px', marginTop: '5px', whiteSpace: 'nowrap', width: '95vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{states.portfolioDetailsWithImages.pictures[currentIndex]?.name ? states.portfolioDetailsWithImages.pictures[currentIndex]?.name : 'NO TITLE'}</Grid>
                                <Grid style={{ fontSize: '16px', whiteSpace: 'nowrap', width: '95vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{states.portfolioDetailsWithImages.pictures[currentIndex]?.description ? states.portfolioDetailsWithImages.pictures[currentIndex]?.description : ''}</Grid>
                            </Grid>
                        </Grid>
                    }

                </Grid>
            ) :

                <Grid>
                    <Skeleton variant="rect" style={{ marginTop: '5px', width: '100vw', height: '100%' }} />
                </Grid>
            }
        </Grid>
    )

}

export default Index;