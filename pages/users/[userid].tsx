import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
import { motion } from "framer-motion";
import styles from './styles.module.css';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { Skeleton } from '@material-ui/lab';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import EditPictureDetailsDialog from '../../components/Helpers/EditPictureDetailsDialog/EditPictureDetailsDialog';
import { useSwipeable } from 'react-swipeable';
import { useSnackbar } from 'notistack';
import PortfolioListWelcome from '../../components/PortfolioListWelcome/PortfolioListWelcome';
import { IPortfolio } from '../../interfaces/dataInterface';
import { useRouter } from 'next/router';
import { CookiesHandler } from '../../components/Helpers/CookiesHandler';



//no empty interface off
interface Props {

}



const Index: React.FC<Props> = () => {
    const actions = useActions()
    const states = useAppState()
    const { position } = states;
    const router = useRouter();
    const { userid } = router.query;
    const { positionSet } = actions;
    const [dataAllPortfolio, setDataAllPortfolio] = useState<Array<IPortfolio>>()
    const [skeleton, setSkeleton] = useState(true);
    const [open, setOpen] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const state = useRef({ x: 0 });
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        state.current.x = e.screenX;
    };
    const loggedinSlug = CookiesHandler.getSlug();

    const useStyles = makeStyles(() => {
        return {
            avatarSize: {
                width: '60px',
                height: '60px',
                backgroundColor: states?.userInfo?.color,
                color: 'white',
                "&:hover": {
                    backgroundColor: states?.userInfo?.color
                }
            },
            profileAvatarSize: {
                width: '45px',
                height: '45px',

            },

        }
    });
    const classes = useStyles();

    const fetchOnePortfolioPaginated = async () => {
        console.log('back', states.countPortfolioPage)
        const { res, err } = await ArtPortfolioServer.getAllPortfoliosPaginated({ slug: userid, pageNumber: states.countPortfolioPage })
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            console.log('new', JSON.stringify(res));
            setDataAllPortfolio(res.arr)
            actions.setUserInfo(res?.userDetails)
            actions.setPortfolioNumber(res?.totalPortfolios)
            // if (states.mainTitle) {
            //     actions.setUserInfo(res.userDetails)
            // }
            actions.setMainTitle(res.userDetails.mainTitle)
            actions.setUserColor(res?.arr[0]?.color)
            setSkeleton(false)
        }
    }

    const fetchOnePortfolioPaginatedMore = async () => {
        const { res, err } = await ArtPortfolioServer.getAllPortfoliosPaginatedLimit({ slug: userid, pageNumber: states.countPortfolioPage })
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            console.log('new', JSON.stringify(res));
            setDataAllPortfolio(res.arr)
            actions.setUserInfo(res?.userDetails)
            actions.setUserColor(res?.arr[0]?.color)
            actions.setPortfolioNumber(res?.totalPortfolios)
            // if (states.mainTitle) {
            //     actions.setUserInfo(res.userDetails)
            // }
            actions.setMainTitle(res.userDetails.mainTitle)
            setSkeleton(false)
        }
    }
    useEffect(() => {
        // const countPortfolio = localStorage.getItem('countPortfolioPage')
        // if (!countPortfolio) {
        //     return
        // }
        // const countPortfolioPage= JSON.parse(countPortfolio)
        // count = 1
        if (userid) {
            // if (states.loadedPortfolio == null && states.countPortfolioPage == 1) {
            if (states.countPortfolioPage == 1) {
                fetchOnePortfolioPaginated()
                console.log('llll')
            }

            else {
                fetchOnePortfolioPaginatedMore()
            }
            // else {
            //     const loadedPortfolios = localStorage.getItem('localLoadedPortfolio');
            //     if (!loadedPortfolios) {
            //         return
            //     }
            //     // const userDetails = localStorage.getItem('userDetails');
            //     const parsedloadPortfolio: Array<IPortfolio> = JSON.parse(loadedPortfolios)
            //     console.log('parsedloadPortfolio', parsedloadPortfolio)
            //     actions.setLoadedPortfolio(parsedloadPortfolio)
            //     setDataAllPortfolio(parsedloadPortfolio)
            //     // actions.setUserInfo(JSON.parse(userDetails))
            //     // actions.setMainTitle(JSON.parse(userDetails))
            //     setSkeleton(false)
            // }

            //     else {

            // }
        }
    }
        , [router])


    const loadMorePortfolio = async (): Promise<null | void> => {
        // count++;
        // console.log(count);
        // if (!dataAllPortfolio) {
        //     return null
        // }
        // else
        if (dataAllPortfolio && dataAllPortfolio?.length < states.totalPortfolioNumber) {
            actions.setCountPortfolioPage(states.countPortfolioPage + 1);
            console.log('actions', states.countPortfolioPage)
            const { res, err } = await ArtPortfolioServer.getAllPortfoliosPaginated({ slug: userid, pageNumber: states.countPortfolioPage })
            if (err) {
                enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
            }
            else {
                console.log(res);
                //   const newPictureArray = portfolioDetails.pictures.concat(res.pictures);
                const newAfterAddedPortfolio = [
                    ...dataAllPortfolio, ...res.arr
                ]
                console.log('dataAllPortfolio', dataAllPortfolio)
                console.log('res', res);
                console.log('newAfterAddedPortfolio', newAfterAddedPortfolio)
                setDataAllPortfolio(newAfterAddedPortfolio);
            }
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const onClickLocalStorageSet = () => {
        // if (dataAllPortfolio) {
        //     actions.setLoadedPortfolio(dataAllPortfolio)
        // }
        const splittedPath = window.location.href.split("/");
        const portfolioUserSlug = splittedPath.pop();
        localStorage.setItem('beforeGoingUserDetailsWhichPosition', JSON.stringify(position + 1))
        // localStorage.setItem('localLoadedPortfolio', JSON.stringify(dataAllPortfolio))
        localStorage.setItem('userDetails', JSON.stringify(states.userInfo))
        localStorage.setItem('countPortfolioPage', JSON.stringify(states.countPortfolioPage))
        sessionStorage.setItem('/userDetails', JSON.stringify(0))
        router.push(`/userDetails/${portfolioUserSlug}`)

    }


    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (dataAllPortfolio && position < dataAllPortfolio.length - 1) {
                console.log('position', position);
                positionSet(position + 1);
                console.log(dataAllPortfolio)
                if (position == dataAllPortfolio.length - 2) {
                    loadMorePortfolio()
                }
            }
        },
        onSwipedRight: () => {
            if (position > 0) {
                positionSet(position - 1);
            }
        },
        delta: 10,
        // touchEventOptions: { passive: false },
        // onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
        preventScrollOnSwipe: true,
        // trackTouch: true,
        trackMouse: true,
    });

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, dataAllPortfolio: Array<IPortfolio>, dataP: Partial<IPortfolio>, index: number) => {
        // setStopClick()
        // if (stopClick===true) {
        const delta = Math.abs(e.screenX - state.current.x);

        if (delta > 10) {
            e.preventDefault();
        }
        else {
            sessionStorage.setItem(`/users/${states.userInfo?.slug}/portfolio/${dataP.slug}`, JSON.stringify(0))
            router.push(`/users/${states.userInfo?.slug}/portfolio/${dataP.slug}`)
            localStorage.setItem('totalPortfolioNumber', JSON.stringify(dataAllPortfolio?.length))
            localStorage.setItem('portfolioNumber', JSON.stringify(index + 1))
            localStorage.setItem('countPortfolioPage', JSON.stringify(states.countPortfolioPage))
            // localStorage.setItem('localLoadedPortfolio', JSON.stringify(dataAllPortfolio))
        }
        // }
        // actions.setLoadedPortfolio(dataAllPortfolio)
    }

    return (
        <motion.div
            className={styles['main']}
        // initial={{ x: 300, opacity: 0 }}
        // animate={{ x: 0, opacity: 1 }}
        // transition={{ type: "linear", duration: '0.8' }}
        // exit={{ x: -300, opacity: 0 }}
        >
            <EditPictureDetailsDialog simplified={true} open={open} setOpen={setOpen}
                currentIndex={0}
            />
            {
                !skeleton && states.userInfo?.avatar ?
                    <>
                        <Grid
                        // style={{ height: '97vh' }}

                        >
                            <Grid className={styles['topContent']}>
                                <Grid>
                                    {
                                        states.userInfo?.slug !== loggedinSlug ? <button
                                            className={styles['textFont']} style={{ border: 'none', textAlign: 'left', background: 'none', color: states?.userInfo?.color, whiteSpace: 'nowrap', width: '70vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{states.userInfo?.mainTitle}
                                        </button> :
                                            <button
                                                onClick={handleClickOpen}
                                                className={styles['textFont']} style={{ border: 'none', textAlign: 'left', background: 'none', color: states?.userInfo?.color, whiteSpace: 'nowrap', width: '70vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{states.userInfo?.mainTitle}
                                            </button>
                                    }
                                </Grid>

                                <Grid onClick={() => { onClickLocalStorageSet() }}>
                                    {/* <Avatar className={styles.avatar} src={states?.userInfo?.avatar?states?.userInfo?.avatar:''} classes={{ root: classes.profileAvatarSize }}
                                            onClick={() => { localStorage.setItem('beforeGoingUserDetailsWhichPosition', position + 1) }}
                                        /> */}
                                    <picture>
                                        <img
                                            src={states?.userInfo?.avatar}
                                            style={{
                                                backgroundColor: '#e3e3e3',
                                                borderRadius: '50%',
                                                margin: '0 auto',
                                                textAlign: 'center',
                                                width: '45px',
                                                height: '45px',
                                                objectFit: 'cover'
                                            }}
                                            alt=""
                                        />
                                    </picture>
                                    {/* <Image
                                        src={states?.userInfo?.avatar}
                                        width={45}
                                        height={45}
                                        // objectFit='cover'
                                        style={{
                                            borderRadius: '50%',
                                            margin: '0 auto',
                                            textAlign: 'center',
                                            backgroundColor: '#e3e3e3',
                                            objectFit: 'cover'
                                        }}
                                        alt=""
                                    /> */}

                                </Grid>

                            </Grid>

                            {/* {
                            dataAllPortfolio?.length == 0 ? actions.positionSet(0) : ''
                        } */}
                            {/* <Swipeable preventDefaultTouchmoveEvent={true} trackMouse={true} onSwiped={handleSwipe} className={styles.App}> */}
                            {
                                dataAllPortfolio?.length === 0 ? <PortfolioListWelcome /> :
                                    <div {...handlers} className={styles['App']}>
                                        <div className={styles['row']}>
                                            {dataAllPortfolio?.map((dataP, index) => {
                                                return (
                                                    <motion.div
                                                        // className={zIndexState ? styles.container : styles.containerNew}
                                                        className={styles['container']}
                                                        key={index}

                                                        initial={{ scale: 0, rotate: 0 }}
                                                        animate={{
                                                            rotate: 0,
                                                            // left: `${(index - position) * 60 - 30}vw`,
                                                            left: `${(index === position) ? -35 : (index - position) * 70 - 35}vw`,
                                                            scale: index === position ? 1 : 0.85,
                                                        }}

                                                    // transition={{
                                                    //     type: "spring",
                                                    //     stiffness: 260,
                                                    //     damping: 20,
                                                    // }}
                                                    >

                                                        <Grid style={{
                                                            position: 'relative', height: '100%', width: '100%'

                                                        }}
                                                        >
                                                            <div className={styles['imgDiv']}
                                                                onMouseDown={(e) => { handleMouseDown(e) }}
                                                                onClick={(e) => { handleClick(e, dataAllPortfolio, dataP, index) }}
                                                            >
                                                                <picture>
                                                                    <img draggable='false' src={dataP?.pictures[0]?.url} alt=""
                                                                        style={{
                                                                            userSelect: 'none',
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover'
                                                                        }}
                                                                    />
                                                                </picture>
                                                                <Grid className={styles['textImage']}>
                                                                    <Typography style={{ fontFamily: 'Bebas Neue', fontWeight: 500, fontSize: '40px', height: '45px', whiteSpace: 'nowrap', width: '60vw', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dataP.name}</Typography>
                                                                    <Typography style={{ paddingBottom: '10px' }}>{dataP.totalPictures} {dataP?.totalPictures && dataP.totalPictures > 1 ? `photographs` : 'photograph'} {dataP.year === 'none' ? "" : `. ${dataP.year}`}</Typography>
                                                                    <Typography style={{ whiteSpace: 'nowrap', width: '60vw', overflow: 'hidden', textOverflow: 'ellipsis' }} >{dataP.description}</Typography>
                                                                </Grid>
                                                            </div>
                                                        </Grid>
                                                        {/* </Link> */}
                                                    </motion.div>

                                                )
                                            })}
                                        </div>
                                        {/* </Swipeable> */}

                                    </div>
                            }
                            {
                                states.userInfo?.slug === loggedinSlug && <Grid className={styles['favIcon']}
                                    onClick={() => {
                                        router.push("/users/create")
                                        localStorage.setItem('beforeGoingCreateWhichPosition', JSON.stringify(position + 1))
                                        localStorage.setItem('countPortfolioPage', JSON.stringify(states.countPortfolioPage))
                                        // localStorage.setItem('localLoadedPortfolio', JSON.stringify(dataAllPortfolio))
                                    }}>
                                    <Fab aria-label="add" classes={{ root: classes.avatarSize }} >
                                        <AddIcon />
                                    </Fab>
                                </Grid>
                            }

                            {/* <button
                                onClick={loadMorePortfolio}
                            style={{color:'black', backgroundColor:'red'}}>Load More</button> */}
                            {
                                dataAllPortfolio?.length === 0 && <svg style={{ overflow: 'hidden' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill={states.userInfo.color} d="M0,32L30,74.7C60,117,120,203,180,224C240,245,300,203,360,165.3C420,128,480,96,540,112C600,128,660,192,720,186.7C780,181,840,107,900,106.7C960,107,1020,181,1080,181.3C1140,181,1200,107,1260,74.7C1320,43,1380,53,1410,58.7L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
                            }
                        </Grid>
                    </>
                    :
                    <Grid

                    >
                        <Grid>
                            <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Skeleton variant="rect" style={{ marginTop: '25px', width: '50%', height: '40px' }} />
                                <Skeleton variant="circle" width={45} height={45} style={{ marginTop: '20px' }} />
                            </Grid>
                            <Skeleton variant="rect" style={{ marginTop: '20px', width: '100%', height: '560px' }} />
                            <Skeleton variant="circle" width={65} height={65} style={{ margin: 'auto', marginTop: '20px' }} />
                        </Grid>
                    </Grid>
            }
        </motion.div >
    );
}

export default Index;




