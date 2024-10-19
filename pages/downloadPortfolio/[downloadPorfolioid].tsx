/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles';
import { Dialog, Fab, Menu, MenuItem } from "@mui/material";
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
import styles from './downloadPortfolio.module.css';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import ImageIcon from '@mui/icons-material/Image';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import ShortTextIcon from '@mui/icons-material/ShortText';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PanoramaIcon from '@mui/icons-material/Panorama';
import Fade from '@mui/material/Fade';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import html2canvas from 'html2canvas';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import StackGrid from "react-stack-grid";
import { useSnackbar } from 'notistack';
import { IPortfolio } from '../../interfaces/dataInterface';
import { useRouter } from 'next/dist/client/router';
// eslint-disable-next-line id-length
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import jsPDF from 'jspdf';


interface Props {

}


const DownloadPorfolioid: React.FC<Props> = () => {
    // Hooks
    const actions = useActions()
    const states = useAppState()

    const useStyles = makeStyles(() => {
        return {
            // Define your styles here
            avatarSize: {
                position: 'absolute',
                height: '54px',
                width: '54px',
                top: '6px',
                color: `${states?.color}`,
                left: '2.5vw',
                borderRadius: '50%',
                zIndex: 3,
                backgroundColor: 'white',
                "&:hover": {
                    backgroundColor: 'white'
                }
            },

            avatarSize2: {
                position: 'absolute',
                height: '53px',
                width: '53px',
                top: '-28px',
                color: `${states?.color}`,
                left: '80vw',
                borderRadius: '50%',
                zIndex: 2,
                backgroundColor: 'white',
                "&:hover": {
                    backgroundColor: 'white'
                }
            },
            menu: {
                padding: '0px',
                width: '107px',
                marginBottom: '8px'
            },
            menu1: {
                padding: '0px',
                width: '160px',
                marginBottom: '8px',
            },
            menu2: {
                padding: '0px',
                width: '155px',
                marginBottom: '8px',
            },

            //download dialog
            paper: {
                minWidth: '85%',
                borderRadius: '30px'
            },


        }
    });

    const classes = useStyles();
    const router = useRouter();
    const { downloadPorfolioid } = router.query;
    const [singlePortfolioDetails, setSinglePortfolioDetails] = useState<IPortfolio>();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerOpenReload, setDrawerOpenReload] = useState(false);
    const [showCoverStyle, setShowCoverStyle] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [anchorAlignCoverTitle, setAnchorAlignCoverTitle] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorAlignCoverTitle);
    const [anchorAlignOwnerName, setAnchorAlignOwnerName] = React.useState<null | HTMLElement>(null);
    const openAlignwnerNameMenu = Boolean(anchorAlignOwnerName);
    const [anchorNumberColums, setAnchorNumberColums] = React.useState<null | HTMLElement>(null);
    const openNumberColumnMenu = Boolean(anchorNumberColums);
    // const [anchorShowArtistName, setAnchorShowArtistName] = React.useState<null | HTMLElement>(null);
    // const openShowArtistNameMenu = Boolean(anchorShowArtistName);

    const [coverImageNumber, setCoverImageNumber] = useState(0);
    //download drawer open dialog
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);

    //cover style state
    // const [coverStyle, setCoverStyle] = useState(true);
    const [showCover, setShowCover] = useState(true);
    const [showCoverImage, setShowCoverImage] = useState(true);

    const [leftAlignCoverTitle, setLeftAlignCoverTitle] = useState(true);
    const [centerAlignCoverTitle, setCenterAlignCoverTitle] = useState(false);
    const [rightAlignCoverTitle, setRightAlignCoverTitle] = useState(false);

    const [leftAlignOwnerName, setLeftAlignOwnerName] = useState(true);
    const [centerAlignOwnerName, setCenterAlignOwnerName] = useState(false);
    const [rightAlignOwnerName, setRightAlignOwnerName] = useState(false);
    // const [showArtistName, setShowArtistName] = useState(true);
    // const [showArtistNameBold, setShowArtistNameBold] = useState(false);
    // const [notShowArtistName, setNotShowArtistName] = useState(false);

    //general style state
    const [showPortfolioName, setShowPortfolioName] = useState(true);
    const [showPortfolioDetails, setShowPortfolioDetails] = useState(true);
    const [oneOriginalSize, setOneOriginalSize] = useState(true);
    const [twoOriginalSize, setTwoOriginalSize] = useState(false);
    const [twoSquareSize, setTwoSquareSize] = useState(false);
    const [threeSquareSize, setThreeSquareSize] = useState(false);




    //title

    const hndleClkShwAlignCovTitleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorAlignCoverTitle(event.currentTarget);
    };

    const handleClickShowAlignOwnerName = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorAlignOwnerName(event.currentTarget);
    };
    const handleClickShowNumberColums = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorNumberColums(event.currentTarget);
    };

    // const handleClickShowArtistName = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorShowArtistName(event.currentTarget);
    // };

    const handleCloseAllMenu = () => {
        setAnchorAlignCoverTitle(null);
        setAnchorAlignOwnerName(null)
        setAnchorNumberColums(null)
        // setAnchorShowArtistName(null)
    };

    const fetchOnePortfolioDetails = async () => {
        if (!downloadPorfolioid) {
            return
        }
        const { res, err } = await ArtPortfolioServer.getOnePortfolioDetails(downloadPorfolioid.toString())
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            setSinglePortfolioDetails(res)
            setCoverImageNumber(res?.coverImage)
            actions.setUserColor(res?.color)
        }
    }

    // useEffect(() => {
    //     document?.getElementById('scrollToTopC')?.scroll(0, 0)
    // }, [showCover])

    const userDetails = async () => {
        const { res, err } = await ArtPortfolioServer.getUserInfo()
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            actions.setUserInfo(res.userDetails)
        }
    }

    useEffect(() => {
        if (downloadPorfolioid) {
            userDetails()
            fetchOnePortfolioDetails();
        }
    }, [router])



    //Image (screenshot) generate

    const scrollTopC = () => {
        document?.getElementById('scrollToTopC')?.scroll(0, 0);
        console.log("SS11");
    }
    const scrollTopG = () => {
        document.getElementById('scrollToTopG')?.scrollIntoView();
        console.log('generateIMGaamammamam');
        console.log("SS2");
    }
    const scrollLeftCG = () => {
        const scl = document.getElementById('scrollToX')
        if (scl) {
            scl.scrollLeft = 0
        }
        console.log('generateLeft');
        console.log("SS3");
    }

    const imageStyle = () => {
        if (oneOriginalSize) {
            return styles['oneOriginalSize']
        }
        // else if (twoOriginalSize) {
        //     return styles.twoOriginalSize
        // }
        else if (twoSquareSize) {
            return styles['twoSquareSize']
        }
        return styles['threeSquareSize']
    }


    async function generateIMG() {
        actions.setDialogLoading(true)
        setOpenDownloadDialog(false);
        const screenTarget = document.getElementById("content");
        if (screenTarget != null) {
            await html2canvas(screenTarget, {

                // logging: true, letterRendering: 1, allowTaint: false,
                useCORS: true
            }).then((canvas) => {
                // Canvas (convert to PNG)
                const base64image = canvas.toDataURL("image/png");
                console.log(base64image)
                const anchor = document.createElement('a');
                anchor.setAttribute("href", base64image);
                console.log(anchor.href);
                if (!singlePortfolioDetails) {
                    return
                }
                anchor.setAttribute("download", `${singlePortfolioDetails.name}.png`);
                anchor.click();
                anchor.remove();
            }
            )
        }
        actions.setDialogLoading(false)
        enqueueSnackbar("PNG Download Completed !", { variant: 'success', autoHideDuration: 2000 })
    }

    //download dialog
    const handleClickOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };
    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    // function dataURLtoFile(dataurl: string, filename: string): File | undefined {
    //     const arr = dataurl.split(',')
    //     if (arr && arr?.length > 0 && arr[0]) {
    //         const mimes = arr[0].match(/:(.*?);/)
    //         if (mimes) {
    //             const mime = mimes[1]
    //             const bstr = atob(arr[1])
    //             let nnn = bstr.length
    //             const u8arr = new Uint8Array(nnn);

    //             while (nnn--) {
    //                 u8arr[nnn] = bstr.charCodeAt(nnn);
    //             }

    //             return new File([u8arr], filename, { type: mime });
    //         }
    //         // return undefined
    //     }
    //     return undefined

    // }







    //PDF generate

    // async function generatePDF() {
    //     const screenTarget = document.getElementById("content");
    //     if (screenTarget != null) {
    //         const canvas = await html2canvas(screenTarget, {
    //             useCORS: true
    //         })
    //         const base64image = canvas.toDataURL("image/png");
    //         console.log(base64image)
    //         const file = dataURLtoFile(base64image, 'xavier.png');
    //         return await Helpers.fileToImageURL(file)
    //     }
    //     return []
    // }

    async function generatePdfFromImages() {
        actions.setDialogLoading(true)
        const page = document.getElementById("content");
        if (page) {
            html2canvas(page, { logging: true, useCORS: true })
                .then((canvas) => {
                    const imageWidth = 450;
                    const imageHeight = (canvas.height * imageWidth) / canvas.width;
                    const imageData = canvas.toDataURL("img/png");

                    // window.open(imageData, "_blank");
                    const pdf = new jsPDF("p", "pt", [imageWidth, imageHeight]);
                    pdf.addImage(imageData, "PNG", 0, 0, imageWidth, imageHeight);
                    if (!singlePortfolioDetails) {
                        return
                    }
                    pdf.save(`${singlePortfolioDetails.name}.pdf`);
                    actions.setDialogLoading(false)
                    enqueueSnackbar("PDF Download Completed !", { variant: 'success', autoHideDuration: 2000 })
                })
                .catch((err) => { console.log(err) });
        }
        // let body = document.body
        // console.log('body',body)
        // let html = document.documentElement
        // console.log('html',html)
        // let height = Math.max(body.scrollHeight, body.offsetHeight,
        //     html.clientHeight, html.scrollHeight, html.offsetHeight)
        // console.log('height', height)
        // let element = document.getElementById('content')
        // console.log('element',element.offsetHeight)
        // let heightCM = height / 35.35
        // console.log('heightCM',heightCM)
        // html2pdf(element, {
        //   margin: 0,
        //   filename: 'export.pdf',
        //   html2canvas: { dpi: 192, letterRendering: true, useCORS: true},
        //   jsPDF: {
        //       orientation: 'portrait',
        //       unit: 'cm',
        //       format: [heightCM,60],

        //     }
        // });

        // actions.setDialogLoading(true)
        // setOpenDownloadDialog(false);
        // const fileUrl = await generatePDF();
        // console.log(fileUrl)
        // if (!singlePortfolioDetails) {
        //     return
        // }
        // Helpers.generatePdfFromImages(fileUrl, singlePortfolioDetails.name);
        // actions.setDialogLoading(false)
        // enqueueSnackbar("PDF Download Completed !", { variant: 'success', autoHideDuration: 2000 })
    }


    // Funcs

    // Vars

    // JSX

    return (
        <div>
            {singlePortfolioDetails && singlePortfolioDetails?.pictures?.length > 0 && (
                <div>
                    <Menu
                        id="fade-menu"
                        anchorEl={anchorAlignCoverTitle}
                        keepMounted
                        open={open}
                        onClose={handleCloseAllMenu}
                        TransitionComponent={Fade}
                        classes={{ list: classes.menu }}
                    >
                        <MenuItem style={leftAlignCoverTitle ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setLeftAlignCoverTitle(true)
                            setCenterAlignCoverTitle(false)
                            setRightAlignCoverTitle(false)
                        }}>
                            <FormatAlignLeftIcon style={{ paddingRight: '10px' }} />Left
                        </MenuItem>
                        <MenuItem style={centerAlignCoverTitle ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setLeftAlignCoverTitle(false)
                            setCenterAlignCoverTitle(true)
                            setRightAlignCoverTitle(false)
                        }}>
                            <FormatAlignCenterIcon style={{ paddingRight: '10px' }} />  Center
                        </MenuItem>
                        <MenuItem style={rightAlignCoverTitle ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setLeftAlignCoverTitle(false)
                            setCenterAlignCoverTitle(false)
                            setRightAlignCoverTitle(true)
                        }}>
                            <FormatAlignRightIcon style={{ paddingRight: '10px' }} />Right
                        </MenuItem>
                    </Menu>

                    <Menu
                        id="fade-menu"
                        anchorEl={anchorAlignOwnerName}
                        keepMounted
                        open={openAlignwnerNameMenu}
                        onClose={handleCloseAllMenu}
                        TransitionComponent={Fade}
                        classes={{ list: classes.menu }}
                    >
                        <MenuItem style={leftAlignOwnerName ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setLeftAlignOwnerName(true)
                            setCenterAlignOwnerName(false)
                            setRightAlignOwnerName(false)
                        }}>
                            <FormatAlignLeftIcon style={{ paddingRight: '10px' }} />Left
                        </MenuItem>
                        <MenuItem style={centerAlignOwnerName ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setLeftAlignOwnerName(false)
                            setCenterAlignOwnerName(true)
                            setRightAlignOwnerName(false)
                        }}>
                            <FormatAlignCenterIcon style={{ paddingRight: '10px' }} />  Center
                        </MenuItem>
                        <MenuItem style={rightAlignOwnerName ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setLeftAlignOwnerName(false)
                            setCenterAlignOwnerName(false)
                            setRightAlignOwnerName(true)
                        }}>
                            <FormatAlignRightIcon style={{ paddingRight: '10px' }} />Right
                        </MenuItem>
                    </Menu>

                    <Menu
                        id="fade-menu"
                        anchorEl={anchorNumberColums}
                        keepMounted
                        open={openNumberColumnMenu}
                        onClose={handleCloseAllMenu}
                        TransitionComponent={Fade}
                        classes={{
                            list: classes.menu1
                        }}
                    >
                        <MenuItem style={oneOriginalSize ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            setTimeout(() => { scrollTopG() }, 100)
                            handleCloseAllMenu()
                            setOneOriginalSize(true)
                            setTwoOriginalSize(false)
                            setTwoSquareSize(false)
                            setThreeSquareSize(false)
                        }}>
                            1 with original size
                        </MenuItem>
                        <MenuItem style={twoOriginalSize ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            setTimeout(() => { scrollTopG() }, 300)
                            handleCloseAllMenu()
                            setOneOriginalSize(false)
                            setTwoOriginalSize(true)
                            setTwoSquareSize(false)
                            setThreeSquareSize(false)
                        }}>
                            2 with original size
                        </MenuItem>
                        <MenuItem style={twoSquareSize ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            setTimeout(() => { scrollTopG() }, 100)
                            handleCloseAllMenu()
                            setOneOriginalSize(false)
                            setTwoOriginalSize(false)
                            setTwoSquareSize(true)
                            setThreeSquareSize(false)
                        }}>
                            2 with square size
                        </MenuItem>
                        <MenuItem style={threeSquareSize ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            setTimeout(() => { scrollTopG() }, 100)
                            handleCloseAllMenu()
                            setOneOriginalSize(false)
                            setTwoOriginalSize(false)
                            setTwoSquareSize(false)
                            setThreeSquareSize(true)
                        }}>
                            3 with square size
                        </MenuItem>
                    </Menu>
                    {/* <Menu
                        id="fade-menu"
                        anchorEl={anchorShowArtistName}
                        keepMounted
                        open={openShowArtistNameMenu}
                        onClose={handleCloseAllMenu}
                        TransitionComponent={Fade}
                        classes={{
                            list: classes.menu2
                        }}
                    >
                        <MenuItem style={showArtistName ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setShowArtistName(true)
                            setShowArtistNameBold(false)
                            setNotShowArtistName(false)
                        }}>
                            Artist name
                        </MenuItem>
                        <MenuItem style={showArtistNameBold ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setShowArtistName(false)
                            setShowArtistNameBold(true)
                            setNotShowArtistName(false)
                        }}>
                            Artist name bold
                        </MenuItem>
                        <MenuItem style={notShowArtistName ? { backgroundColor: '#7E7E7E', minHeight: '42px' } : { backgroundColor: '', minHeight: '42px' }} onClick={() => {
                            handleCloseAllMenu()
                            setShowArtistName(false)
                            setShowArtistNameBold(false)
                            setNotShowArtistName(true)
                        }}>
                            No Artist name
                        </MenuItem>
                    </Menu> */}

                    {/* download dialog */}

                    <Dialog
                        open={openDownloadDialog}
                        onClose={handleCloseDownloadDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        classes={{ paper: classes.paper }}
                    >
                        <div className={styles['title']}>
                            <div style={{ display: 'flex', flexDirection: 'row', margin: '30px auto', cursor: 'pointer' }} onClick={() => { generatePdfFromImages() }}>
                                <div style={{ marginTop: '2px' }}><PictureAsPdfIcon /></div>
                                <div style={{ paddingLeft: '10px' }}>DOWNLOAD AS PDF (BETA)</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', margin: '30px auto', cursor: 'pointer' }} onClick={() => { generateIMG() }}>
                                <div style={{ marginTop: '2px' }}><PanoramaIcon /> </div>
                                <div style={{ paddingLeft: '10px' }}>DOWNLOAD AS IMAGE</div>
                            </div>
                        </div>
                    </Dialog>


                    <div style={{
                        position: 'absolute', width: '100vw', backgroundColor: 'rgb(169 172 173)', right: '0px',
                        bottom: '0px',
                        top: '0px',
                        left: '0px'
                    }}>
                        <div style={{ backgroundColor: 'white', margin: 'auto', width: '95vw' }}>
                            <Fab aria-label="add" classes={{ root: classes.avatarSize }} onClick={() => { router.back() }}
                            >
                                <ArrowBackIcon style={{ fontSize: '40px' }} />
                            </Fab>
                            <div className={styles['scrollDiv']} id="scrollToTopC">
                                <div style={{ padding: '0px 3vw 35px' }} id="content">
                                    {showCover ?
                                        <div className={styles['showAnim']}>
                                            <div style={{ margin: 'auto', position: 'relative', color: `${states?.color}` }} >
                                                <picture>
                                                    <img style={{ backgroundColor: '#e3e3e3' }} src={singlePortfolioDetails?.pictures[coverImageNumber - 1]?.url} className={showCoverImage ? styles['image'] : styles['imageHide']} alt="" />
                                                </picture>

                                                <div className={styles['leftCoverImagePortfolioName']}>
                                                    <div style={leftAlignCoverTitle ? { fontFamily: 'Bebas Neue', whiteSpace: 'nowrap', width: '70vw', overflow: 'hidden', textOverflow: 'ellipsis' } : { display: 'none' }}>{singlePortfolioDetails.name}</div>
                                                </div>
                                                <div className={styles['leftCoverImageOwnerName']}>
                                                    <div className={leftAlignOwnerName ? styles['ownerName'] : styles['ownerNameHide']}>by <span>{states.userInfo?.fullName}</span></div>
                                                </div>

                                                <div className={styles['centerCoverImagePortfolioName']}>
                                                    <div style={centerAlignCoverTitle ? { fontFamily: 'Bebas Neue', whiteSpace: 'nowrap', width: '75vw', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' } : { display: 'none' }}>{singlePortfolioDetails.name}</div>
                                                </div>
                                                <div className={styles['centerCoverImageOwnerName']}>
                                                    <div className={centerAlignOwnerName ? styles['ownerName'] : styles['ownerNameHide']}>by <span>{states.userInfo?.fullName}</span></div>
                                                </div>

                                                <div className={styles['rightCoverImagePortfolioName']}>
                                                    <div style={rightAlignCoverTitle ? { fontFamily: 'Bebas Neue', whiteSpace: 'nowrap', width: '70vw', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' } : { display: 'none' }}>{singlePortfolioDetails.name}</div>
                                                </div>
                                                <div className={styles['rightCoverImageOwnerName']}>
                                                    <div className={rightAlignOwnerName ? styles['ownerName'] : styles['ownerNameHide']}>by <span>{states.userInfo?.fullName}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className={styles['hiddenAnim']}>
                                            <div style={{ margin: 'auto', position: 'relative', color: `${states?.color}` }} >
                                                <picture>
                                                    <img style={{ backgroundColor: '#e3e3e3' }} src={singlePortfolioDetails?.pictures[coverImageNumber - 1]?.url} className={showCoverImage ? styles['image'] : styles['imageHide']} alt="" />
                                                </picture>
                                                <div className={styles['leftCoverImagePortfolioName']}>
                                                    <div style={leftAlignCoverTitle ? { fontFamily: 'Bebas Neue' } : { display: 'none' }}>{singlePortfolioDetails.name}</div>
                                                </div>
                                                <div className={styles['leftCoverImageOwnerName']}>
                                                    <div className={leftAlignOwnerName ? styles['ownerName'] : styles['ownerNameHide']}>by <span>{states.userInfo?.fullName}</span></div>
                                                </div>

                                                <div className={styles['centerCoverImagePortfolioName']}>
                                                    <div style={centerAlignCoverTitle ? { fontFamily: 'Bebas Neue' } : { display: 'none' }}>{singlePortfolioDetails.name}</div>
                                                </div>
                                                <div className={styles['centerCoverImageOwnerName']}>
                                                    <div className={centerAlignOwnerName ? styles['ownerName'] : styles['ownerNameHide']}>by <span>{states.userInfo?.fullName}</span></div>
                                                </div>

                                                <div className={styles['rightCoverImagePortfolioName']}>
                                                    <div style={rightAlignCoverTitle ? { fontFamily: 'Bebas Neue' } : { display: 'none' }}>{singlePortfolioDetails.name}</div>
                                                </div>
                                                <div className={styles['rightCoverImageOwnerName']}>
                                                    <div className={rightAlignOwnerName ? styles['ownerName'] : styles['ownerNameHide']}>by <span>{states.userInfo?.fullName}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <div className={styles['scroll']} id="scrollToTopG">
                                        {showPortfolioName ?
                                            <div className={styles['showAnim']}>
                                                <div className={styles['portfolioName']} style={{ color: `${states?.color}`, wordBreak: 'break-word', height: 'auto' }}>{singlePortfolioDetails.name}</div>
                                            </div>
                                            :
                                            <div className={styles['hiddenAnim']}>
                                                <div className={styles['portfolioName']} style={{ color: `${states?.color}`, wordBreak: 'break-word', height: 'auto' }}>{singlePortfolioDetails.name}</div>
                                            </div>
                                        }
                                        {showPortfolioDetails ?
                                            <div className={styles['showAnim']}>
                                                <div className={styles['pictureNumber']}>{singlePortfolioDetails?.pictures?.length} {singlePortfolioDetails?.pictures?.length > 1 ? 'photographs' : 'photograph'}{singlePortfolioDetails?.year === 'none' ? '' : <span style={{ marginBottom: '2px' }}> .{singlePortfolioDetails?.year}</span>}</div>
                                            </div>
                                            : <div className={styles['hiddenAnim']}>
                                                <div className={styles['pictureNumber']}>{singlePortfolioDetails?.pictures?.length} {singlePortfolioDetails?.pictures?.length > 1 ? 'photographs' : 'photograph'}{singlePortfolioDetails?.year === 'none' ? '' : <span style={{ marginBottom: '2px' }}> .{singlePortfolioDetails?.year}</span>}</div>
                                            </div>
                                        }
                                        <div className={styles['portfolioDescription']} style={{ wordWrap: 'break-word' }}>{singlePortfolioDetails.description}</div>
                                        {twoSquareSize || threeSquareSize || oneOriginalSize ?
                                            <div className={imageStyle()}>
                                                {singlePortfolioDetails?.pictures?.map((item, index) => {
                                                    return (
                                                        <div
                                                            onClick={() => {
                                                                router.push(`/imageDetails/${downloadPorfolioid}/${index}`)
                                                                localStorage.setItem('picture index', JSON.stringify(index))
                                                            }}
                                                            key={item?._id}
                                                        >
                                                            <picture>
                                                                <img style={{ backgroundColor: '#e3e3e3' }} src={item.url} className={styles['image1']} alt="" />
                                                            </picture>
                                                            {oneOriginalSize &&
                                                                <p className={styles['imageText']}>{item.name}</p>
                                                            }

                                                        </div>
                                                    )

                                                })}
                                            </div>
                                            :
                                            <div>
                                                <StackGrid
                                                    columnWidth={"50%"}
                                                    duration={0}
                                                    style={{ zIndex: 1 }}
                                                    monitorImagesLoaded={true}
                                                    gutterWidth={5}
                                                    gutterHeight={0}
                                                >
                                                    {singlePortfolioDetails?.pictures?.map((item, index) => {
                                                        return (
                                                            <div
                                                                className={styles['images']}
                                                                onClick={() => {
                                                                    router.push(`/imageDetails/${downloadPorfolioid}/${index}`)
                                                                    localStorage.setItem('picture index', JSON.stringify(index))
                                                                }}
                                                                key={item._id}
                                                            >
                                                                <picture>
                                                                    <img src={item?.url} style={{ width: '100%' }} alt="" />
                                                                </picture>
                                                                <p className={item.name ? styles['imageText'] : styles['marg']}>{item.name}</p>

                                                            </div>
                                                        )
                                                    })
                                                    }

                                                </StackGrid>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {drawerOpen ?
                            <div className={styles['drawerFullContainerOpen']} style={{ backgroundColor: `${states?.color}`, left: '0px', zIndex: 2 }}>
                                <Fab aria-label="add" classes={{ root: classes.avatarSize2 }} onClick={() => { handleClickOpenDownloadDialog() }} >
                                    <GetAppIcon style={{ fontSize: '40px' }} />
                                </Fab>
                                <div style={{ height: '40px' }} onClick={() => {
                                    setDrawerOpen(!drawerOpen)
                                    setDrawerOpenReload(true)
                                }}>
                                </div>
                                <div style={{ color: 'white' }}>
                                    <div style={{ paddingLeft: '5vw', display: 'flex' }}>
                                        <div className={showCoverStyle ? styles['drawer'] : ''} onClick={() => {
                                            setTimeout(() => { scrollLeftCG() }, 100)
                                            setTimeout(() => { scrollTopC() }, 150)
                                            setShowCoverStyle(true)
                                            setDrawerOpen(true)
                                        }}>
                                            <p className={styles['drawerTitle']} >COVER STYLE</p>
                                        </div>
                                        <div className={showCoverStyle ? '' : styles['drawer']} onClick={() => {
                                            setTimeout(() => { scrollLeftCG() }, 100)
                                            setTimeout(() => { scrollTopG() }, 150)
                                            setShowCoverStyle(false)
                                            setDrawerOpen(true)
                                        }}>
                                            <p className={styles['drawerTitle']} >GENERAL STYLE</p>
                                        </div>
                                    </div>
                                    {
                                        showCoverStyle ?
                                            <div className={styles['drawerDivParent']} id="scrollToX">
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: showCover ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopC()
                                                    setShowCover(!showCover)
                                                }}>
                                                    <div style={{ color: showCover ? '' : 'darkGray' }}>
                                                        <PhotoAlbumIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show cover</p>
                                                    </div>
                                                </div>
                                                <div className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} style={{ backgroundColor: `${states?.color}`, filter: showCoverImage ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopC()
                                                    setShowCoverImage(!showCoverImage)
                                                }}>
                                                    <div style={{ color: showCoverImage ? '' : 'darkGray' }}>
                                                        <ImageIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show cover image</p>
                                                    </div>
                                                </div>
                                                <div className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} aria-controls="fade-menu" aria-haspopup="true" style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => {
                                                    scrollTopC()
                                                    hndleClkShwAlignCovTitleMenu(e)
                                                }}>
                                                    <div>
                                                        {centerAlignCoverTitle ?
                                                            <FormatAlignCenterIcon style={{ fontSize: '40px' }} />
                                                            : rightAlignCoverTitle ?
                                                                <FormatAlignRightIcon style={{ fontSize: '40px' }} />
                                                                :
                                                                <FormatAlignLeftIcon style={{ fontSize: '40px' }} />
                                                        }
                                                        <p className={styles['iconText']}>Align cover title</p>
                                                    </div>
                                                </div>
                                                {/* <Grid className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => {
                                                    scrollTopC()
                                                    handleClickShowArtistName(e)
                                                }}>
                                                    <Grid>
                                                        <AccountCircleIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconText']}>Show my name</p>
                                                    </Grid>
                                                </Grid> */}
                                                <div className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} aria-controls="fade-menu" aria-haspopup="true" style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => {
                                                    scrollTopC()
                                                    handleClickShowAlignOwnerName(e)
                                                }}>
                                                    <div>
                                                        {centerAlignOwnerName ?
                                                            <FormatAlignCenterIcon style={{ fontSize: '40px' }} />
                                                            : rightAlignOwnerName ?
                                                                <FormatAlignRightIcon style={{ fontSize: '40px' }} />
                                                                :
                                                                <FormatAlignLeftIcon style={{ fontSize: '40px' }} />
                                                        }
                                                        <p className={styles['iconText']}>Align my name</p>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className={styles['drawerDivParent']} id="scrollToX">
                                                <Link href={`/userDetails/${singlePortfolioDetails?.userSlug}`} style={{ textDecoration: 'none' }}>
                                                    <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }}>
                                                        <div style={{ color: 'white' }}>
                                                            <RadioButtonUncheckedRoundedIcon style={{ fontSize: '60px', color: 'white' }} />
                                                            <p className={styles['iconTextWidth']}>Accent color</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: showPortfolioName ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopG()
                                                    setShowPortfolioName(!showPortfolioName)
                                                }}>
                                                    <div style={{ color: showPortfolioName ? '' : 'darkGray' }}>
                                                        <FontDownloadIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show portfolio name</p>
                                                    </div>
                                                </div>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: showPortfolioDetails ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopG()
                                                    setShowPortfolioDetails(!showPortfolioDetails)
                                                }}>
                                                    <div style={{ color: showPortfolioDetails ? '' : 'darkGray' }}>
                                                        <ShortTextIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show portfolio details</p>
                                                    </div>
                                                </div>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => { handleClickShowNumberColums(e) }}>
                                                    <div>
                                                        {
                                                            oneOriginalSize ?
                                                                <LooksOneIcon style={{ fontSize: '40px' }} /> :
                                                                twoOriginalSize || twoSquareSize ?
                                                                    <LooksTwoIcon style={{ fontSize: '40px' }} /> :
                                                                    <Looks3Icon style={{ fontSize: '40px' }} />
                                                        }
                                                        <p className={styles['iconTextWidth']}>Number of columns</p>
                                                    </div>
                                                </div>

                                            </div>

                                    }
                                </div>

                            </div>
                            :
                            <div className={drawerOpenReload ? styles['drawerFullContainerClose'] : styles['displayDrawer']} style={{ backgroundColor: `${states?.color}`, left: '0px', zIndex: 2 }} >
                                <Fab aria-label="add" classes={{ root: classes.avatarSize2 }} onClick={() => { handleClickOpenDownloadDialog() }} >
                                    <GetAppIcon style={{ fontSize: '40px' }} />
                                </Fab>
                                <div style={{ height: '40px' }} onClick={() => {
                                    setDrawerOpen(!drawerOpen)
                                    setDrawerOpenReload(true)
                                }}>

                                </div>
                                <div style={{ color: 'white' }}>
                                    <div style={{ paddingLeft: '5vw', display: 'flex' }}>
                                        <div className={showCoverStyle ? styles['drawer'] : ''} onClick={() => {
                                            scrollTopC()
                                            setShowCoverStyle(true)
                                            setDrawerOpen(true)
                                        }}>
                                            <p className={styles['drawerTitle']} >COVER STYLE</p>
                                        </div>
                                        <div className={showCoverStyle ? '' : styles['drawer']} onClick={() => {
                                            scrollTopG()
                                            setShowCoverStyle(false)
                                            setDrawerOpen(true)
                                        }}>
                                            <p className={styles['drawerTitle']} > GENERAL STYLE</p>
                                        </div>
                                    </div>
                                    {
                                        showCoverStyle ?
                                            <div className={styles['drawerDivParent']}>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: showCover ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopC()
                                                    setShowCover(!showCover)
                                                }}>
                                                    <div style={{ color: showCover ? '' : 'darkGray' }}>
                                                        <PhotoAlbumIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show cover</p>
                                                    </div>
                                                </div>
                                                <div className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} style={{ backgroundColor: `${states?.color}`, filter: showCoverImage ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopC()
                                                    setShowCoverImage(!showCoverImage)
                                                }}>
                                                    <div style={{ color: showCoverImage ? '' : 'darkGray' }}>
                                                        <ImageIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show cover image</p>
                                                    </div>
                                                </div>
                                                <div className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} aria-controls="fade-menu" aria-haspopup="true" style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => {
                                                    scrollTopC()
                                                    hndleClkShwAlignCovTitleMenu(e)
                                                }}>
                                                    <div>
                                                        {centerAlignCoverTitle ?
                                                            <FormatAlignCenterIcon style={{ fontSize: '40px' }} />
                                                            : rightAlignCoverTitle ?
                                                                <FormatAlignRightIcon style={{ fontSize: '40px' }} />
                                                                :
                                                                <FormatAlignLeftIcon style={{ fontSize: '40px' }} />
                                                        }
                                                        <p className={styles['iconText']}>Align cover title</p>
                                                    </div>
                                                </div>
                                                {/* <Grid className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => {
                                                    scrollTopC()
                                                    handleClickShowArtistName(e)
                                                }}>
                                                    <Grid>
                                                        <AccountCircleIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconText']}>Show my name</p>
                                                    </Grid>
                                                </Grid> */}
                                                <div className={showCover ? styles['drawerDiv'] : styles['drawerDivHide']} aria-controls="fade-menu" aria-haspopup="true" style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => {
                                                    scrollTopC()
                                                    handleClickShowAlignOwnerName(e)
                                                }}>
                                                    <div>
                                                        {centerAlignOwnerName ?
                                                            <FormatAlignCenterIcon style={{ fontSize: '40px' }} />
                                                            : rightAlignOwnerName ?
                                                                <FormatAlignRightIcon style={{ fontSize: '40px' }} />
                                                                :
                                                                <FormatAlignLeftIcon style={{ fontSize: '40px' }} />
                                                        }
                                                        <p className={styles['iconText']}>Align my name</p>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className={styles['drawerDivParent']}>
                                                <Link href="/userDetails" style={{ textDecoration: 'none' }}>
                                                    <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }}>
                                                        <div style={{ color: 'white' }}>
                                                            <RadioButtonUncheckedRoundedIcon style={{ fontSize: '60px' }} />
                                                            <p className={styles['iconTextWidth']}>Accent color</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: showPortfolioName ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopG()
                                                    setShowPortfolioName(!showPortfolioName)
                                                }}>
                                                    <div style={{ color: showPortfolioName ? '' : 'darkGray' }}>
                                                        <FontDownloadIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show portfolio name</p>
                                                    </div>
                                                </div>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: showPortfolioDetails ? 'brightness(125%)' : '' }} onClick={() => {
                                                    scrollTopG()
                                                    setShowPortfolioDetails(!showPortfolioDetails)
                                                }}>
                                                    <div style={{ color: showPortfolioDetails ? '' : 'darkGray' }}>
                                                        <ShortTextIcon style={{ fontSize: '40px' }} />
                                                        <p className={styles['iconTextWidth']}>Show portfolio details</p>
                                                    </div>
                                                </div>
                                                <div className={styles['drawerDiv']} style={{ backgroundColor: `${states?.color}`, filter: 'brightness(125%)' }} onClick={(e) => { handleClickShowNumberColums(e) }}>
                                                    <div>{
                                                    }
                                                        {
                                                            oneOriginalSize ?
                                                                <LooksOneIcon style={{ fontSize: '40px' }} /> :
                                                                twoOriginalSize || twoSquareSize ?
                                                                    <LooksTwoIcon style={{ fontSize: '40px' }} /> :
                                                                    <Looks3Icon style={{ fontSize: '40px' }} />
                                                        }
                                                        <p className={styles['iconTextWidth']}>Number of columns</p>
                                                    </div>
                                                </div>

                                            </div>

                                    }
                                </div>

                            </div>
                        }
                    </div>
                </div>
            )}
        </div>
    )

}

export default DownloadPorfolioid;