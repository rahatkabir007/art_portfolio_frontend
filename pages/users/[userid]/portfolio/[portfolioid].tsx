
import React, {
  useEffect, useState
} from 'react';
import { Fab, Grid, Typography } from "@mui/material";
import { useActions, useAppState } from '../../../../src/Overmind/OvermindHelper';
import { useRouter } from 'next/router';
import styles from "./portfolioid.module.css";
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import GetAppIcon from '@mui/icons-material/GetApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CookiesHandler } from '../../../../components/Helpers/CookiesHandler';
import { Skeleton } from "@mui/material";
import KeyboardSpaceBackIcon from '../../../../components/Helpers/KeyboardSpaceBackIcon';
import { ArtPortfolioServer } from '../../../../src/Others/ArtPortfolioServer';
import PortfolioMenu from '../../../../components/PortfolioMenu/PortfolioMenu';
import { useSnackbar } from 'notistack';
// import ShareMenu from '../../../../components/ShareMenu/ShareMenu';
import DeleteMenu from '../../../../components/DeleteMenu/DeleteMenu';
import ShareIcon from '@mui/icons-material/Share';
import StyleIcon from '@mui/icons-material/Style';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import StackGrid from "react-stack-grid";
import { motion } from "framer-motion";
import { IPortfolio } from '../../../../interfaces/dataInterface';
import FeedbackIcon from '@mui/icons-material/Feedback';



interface Props {

}

const IconStyle = {
  fontSize: '20px',
  marginRight: '25px',
  color: 'white'
}


let count = 1;
const Portfolioid: React.FC<Props> = () => {
  // Hooks
  const actions = useActions()
  const states = useAppState()

  // var scrollPosition = 0;

  const useStyles = makeStyles(() => {
    return {
      // Define your styles here
      avatarSize: {
        width: '60px',
        height: '60px',
        backgroundColor: states?.color ? states?.color : '#000',
        color: 'white',
        zIndex: 5,
        "&:hover": {
          zIndex: 5,
          backgroundColor: states?.color
        }
      },
    }
  });

  const classes = useStyles();
  const router = useRouter();
  console.log('rr', router)

  const { portfolioid } = router.query;
  const [portfolioDetails, setPotfolioDetails] = useState<IPortfolio>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenReload, setDrawerOpenReload] = useState(false);
  // const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  // const [shareDrawerOpenReload, setShareDrawerOpenReload] = useState(false);
  const [styleDrawerOpen, setStyleDrawerOpen] = useState(false);
  const [styleDrawerOpenReload, setStyleDrawerOpenReload] = useState(false);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [deleteDrawerOpenReload, setDeleteDrawerOpenReload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // restoreScrollPosition(router, '#hell');
  const loggedinSlug = CookiesHandler.getSlug();


  const fetchOnePortfolioPicPaginated = async () => {
    const { res, err } = await ArtPortfolioServer.getOnePortfolioPicPaginated({ slug: portfolioid, pageNumber: 1 })
    if (err) {
      enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
    }
    else {
      setPotfolioDetails(res)
      console.log('color', res.color);
      actions.setUserColor(res?.color)
      if (res.userSlug !== loggedinSlug && res.privacy === 'private') {
        enqueueSnackbar('No Access', { variant: 'error', autoHideDuration: 2000 });
        const splittedPath = window.location.href.split("/");
        splittedPath.pop();
        splittedPath.pop();
        const path = splittedPath.join("/");
        router.push(path)
      }
      console.log('portres', res);
      if (res.style) {
        actions.setStylePortfolioNumber(res?.style)
        actions.setInitialStylePortfolioNumber(res.style)
      }


      //after reload position set fix
      // const getsrollySession = sessionStorage.getItem(window.location.pathname ?? 0)
      // if (!getsrollySession) {
      //   console.log('hello')
      //   return
      // }
      // setTimeout(() => {
      //     window.scroll(0, parseInt(getsrollySession))
      // }, 1000)
      const portfolioNum = localStorage.getItem('portfolioNumber');
      const countPortfolioP = localStorage.getItem('countPortfolioPage');
      if (!countPortfolioP || !portfolioNum) {
        return
      }
      const portfolioNumber: string = JSON.parse(portfolioNum)
      const countPortfolioPage: string = JSON.parse(countPortfolioP)

      actions.positionSet(parseInt(portfolioNumber) - 1);
      actions.setCountPortfolioPage(parseInt(countPortfolioPage))
      console.log('kkkk')
      // actions.setLoadedPortfolio(loadedPortfolios)

    }
  }

  const afterDeletePositionUserInfoSet = async () => {
    if (!portfolioDetails) {
      return
    }
    if (portfolioDetails.userSlug !== loggedinSlug) {
      enqueueSnackbar("No Access!", { variant: 'error', autoHideDuration: 2000 })
      return
    }

    const totalPortfol = localStorage.getItem('totalPortfolioNumber');
    const portfolioNum = localStorage.getItem('portfolioNumber');
    if (!portfolioNum || !totalPortfol) {
      return
    }
    const portfolioNumber = JSON.parse(portfolioNum)
    const totalPortfolio = JSON.parse(totalPortfol)
    // const loaded = localStorage.getItem('localLoadedPortfolio');
    // if (!loaded || !portfolioNumber) {

    // const parsedloadPortfolio: Array<IPortfolio> = JSON.parse(loaded)

    // const afterDeleteLoadPortfolio = parsedloadPortfolio.filter((_item, index) => {
    //   return index != JSON.parse(portfolioNumber) - 1
    // })
    // console.log('afterDeletePort', afterDeleteLoadPortfolio)
    // localStorage.setItem('localLoadedPortfolio', JSON.stringify(afterDeleteLoadPortfolio))

    // console.log(totalPortfolio, portfolioNumber);

    if (totalPortfolio == portfolioNumber && portfolioNumber != 1) {
      actions.positionSet(states.position - 1)
    }

    actions.setDialogLoading(true)
    if (!portfolioid) {
      return
    }

    const { err } = await ArtPortfolioServer.deleteOnePortfolio(portfolioid?.toString())

    if (err) {
      enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
    }
    else {
      router.back()
      setTimeout(() => {
        actions.setDialogLoading(false)
      }, 1000)
      enqueueSnackbar("Portfolio delete successful !", { variant: 'success', autoHideDuration: 2000 })
    }
  }

  // const userDetails = async () => {
  //   const cookie = CookiesHandler.getAccessToken();
  //   if (cookie) {
  //     const { res, err } = await ArtPortfolioServer.getUserInfo()
  //     if (err) {
  //       enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
  //     }
  //     else {
  //       actions.setUserInfo(res.userDetails)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (portfolioDetails && portfolioDetails?.pictures?.length > 0 ) {
  //     console.log('aaaa', window.location.pathname)
  // const getsrollySession = sessionStorage.getItem(window.location.pathname ?? 0)
  // if (!getsrollySession) {
  //   return
  // }
  // setTimeout(() => {
  //   window.scroll(0, parseInt(getsrollySession))
  // },1000)
  //     }
  // })

  useEffect(() => {
    if (portfolioid) {
      // userDetails()
      count = 1
      fetchOnePortfolioPicPaginated()

    }

  }, [portfolioid])



  const imageStyle = () => {
    if (states?.stylePortfolioNumber == 1) {
      return styles['originalImage']
    }
    else if (states?.stylePortfolioNumber == 2) {
      return styles['twoColumnSquareImage']
    }
    else if (states?.stylePortfolioNumber == 3) {
      return styles['threeColumnSquareImage']
    }
    return ''
    // else {
    //   return styles.straggeredImageSize
    // }
  }

  // const drawerOpenVisibleHide = () => {
  //   if (deleteDrawerOpen || styleDrawerOpen || shareDrawerOpen) {
  //     console.log('hello')
  //     return styles['visibleHide']
  //   }
  // }

  const drawerOpenVisibleHide = () => {
    if (deleteDrawerOpen || styleDrawerOpen) {
      return styles['visibleHide']
    }
    return ''
  }

  const loadMorePictures = async () => {
    count++;
    console.log(count);
    const { res, err } = await ArtPortfolioServer.getOnePortfolioPicPaginated({ slug: portfolioid, pageNumber: count })
    if (err) {
      enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
    }
    else {
      console.log(res);
      if (!portfolioDetails) {
        return
      }
      const newPictureArray = portfolioDetails.pictures.concat(res.pictures);
      const newPortfolioDetails = {
        ...portfolioDetails,
        pictures: newPictureArray
      }
      setPotfolioDetails(newPortfolioDetails);
    }
  }

  const updateOnePortfolioDetails = async (portfolioStyleNumber: number, portfolioid: string) => {
    const onePortfolioData = {
      slug: portfolioid, style: portfolioStyleNumber
    }

    console.log('onePortfolio', onePortfolioData);
    const { err } = await ArtPortfolioServer.updateOnePortfolio(onePortfolioData)
    if (isNaN(err as number)) {
      return
    }
    if (err) {
      enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
    }
    else {
      enqueueSnackbar("Portfolio Style Updated !", { variant: 'success', autoHideDuration: 2000 })
    }
  }

  const handleStyleDrawerClose = (e: boolean) => {
    if (styleDrawerOpen && states?.stylePortfolioNumber && portfolioid && states.stylePortfolioNumber != states.initialStylePortfolioNumber) {
      updateOnePortfolioDetails(states?.stylePortfolioNumber, portfolioid.toString())
      actions.setInitialStylePortfolioNumber(states.stylePortfolioNumber)
    }
    setStyleDrawerOpen(e)

  };
  const handleClose = (e: boolean) => {
    actions.setStylePortfolioNumber(states.initialStylePortfolioNumber as number)
    actions.setInitialStylePortfolioNumber(states.stylePortfolioNumber as number)
    setStyleDrawerOpen(e)
  };

  if (portfolioDetails?.userSlug !== loggedinSlug && portfolioDetails?.privacy === 'private') {
    return null
  }

  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }

  return (
    <Grid >
      {portfolioDetails && portfolioDetails?.pictures?.length > 0 ?
        <motion.div>
          <Grid
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }}

          >
            <Grid onClick={() => {
              setDrawerOpen(false)
              // setShareDrawerOpen(false)  
              handleStyleDrawerClose(false)
              setDeleteDrawerOpen(false)
              setTimeout(() => {
                actions.setStyleDrawer(false)
              }, 400)
            }}>
              <KeyboardSpaceBackIcon windowPathName={window.location.pathname} />
              <Grid style={{ height: '100vh' }} id="hell">
                <Grid className={styles['descContainer']}>
                  <Typography className={styles['portfolio_name']} style={{ color: states?.color, wordWrap: 'break-word', lineHeight: 1, marginBottom: '15px' }}>
                    {portfolioDetails.name}
                  </Typography>
                  <Grid container className={styles['text']}>
                    <Typography>{portfolioDetails?.totalPictures}
                      {portfolioDetails?.pictures?.length > 1 ? ' photographs' : ' photograph'}
                      {portfolioDetails?.year === 'none' ? '' : <span style={{ marginBottom: '2px' }}> .{portfolioDetails?.year}</span>}
                    </Typography>
                  </Grid>
                  <Typography className={styles['description']} style={{ wordWrap: 'break-word', paddingBottom: '15px' }}>
                    {portfolioDetails?.description}
                  </Typography>
                </Grid>

                {states?.stylePortfolioNumber != 4 ?
                  <Grid className=
                    {imageStyle()}
                  >
                    {portfolioDetails?.pictures?.map((item, index) => {
                      return (
                        <Grid
                          key={item?._id}
                        >
                          <Grid
                            className={styles['images']}
                            onClick={() => {
                              if (!drawerOpen) {
                                router.push(`/imageDetails/${portfolioid}/${index}`)
                                localStorage.setItem('picture index', JSON.stringify(index))
                              }
                            }}
                          >
                            <picture>
                              <img src={item.url} className={styles['image1']} alt="k" />
                            </picture>
                            {(states.stylePortfolioNumber == 1 || states.stylePortfolioNumber == 4) &&
                              <p className={item.name ? styles['imageText'] : styles['marg']}>{item.name}</p>
                            }
                          </Grid>

                        </Grid>
                      )
                    })
                    }

                  </Grid>
                  :
                  <StackGrid
                    columnWidth={"50%"}
                    duration={0}
                    style={{ zIndex: drawerOpen ? -1 : 1 }}
                    monitorImagesLoaded={true}
                    gutterWidth={5}
                    gutterHeight={0}
                  >
                    {portfolioDetails?.pictures?.map((item, index) => {
                      return (
                        <Grid
                          key={item?._id}
                          className={styles['images']}
                          onClick={() => {
                            if (!drawerOpen) {
                              router.push(`/imageDetails/${portfolioid}/${index}`)
                              localStorage.setItem('picture index', JSON.stringify(index))
                            }
                          }}
                        >
                          <picture>
                            <img src={item?.url} style={{ width: '100%' }} alt="l" />
                          </picture>
                          <p className={item.name ? styles['imageText'] : styles['marg']}>{item.name}</p>
                        </Grid>
                      )
                    })}

                  </StackGrid>
                }
                <Grid
                  className=
                  {styles['loadMore']}
                >
                  <button
                    onClick={loadMorePictures}
                    style={portfolioDetails?.pictures?.length == portfolioDetails?.totalPictures ? { display: 'none' } : { display: 'block' }}
                  >Load More</button>
                </Grid>

              </Grid>
            </Grid>
            <div>

              <Grid>
                <Fab aria-label="add" classes={{ root: classes.avatarSize }}
                  onClick={() => {
                    setDrawerOpen(!drawerOpen)
                    setDrawerOpenReload(true)
                    // setShareDrawerOpen(false)
                    handleStyleDrawerClose(false)
                    setDeleteDrawerOpen(false)
                    setTimeout(() => {
                      actions.setStyleDrawer(false)
                      console.log('kkkuuu2');
                    }, 400)
                  }}
                  style={{
                    bottom: '55px', position: 'fixed', left: '50%', transform: 'translate(-50%, 0%)', textAlign: 'center'
                  }}
                >
                  <MenuIcon />
                </Fab>

                {
                  drawerOpen ?
                    <Grid className={styles['animGrow']}>
                      <Grid style={{ width: '100%', backgroundColor: states?.color ? states?.color : 'black', color: 'white', borderRadius: '20px' }}>
                        <Grid className={drawerOpenVisibleHide()}>
                          <Grid style={{ paddingTop: '20px', height: '380px', textAlign: 'left' }}>
                            <button onClick={() => {
                              sessionStorage.setItem(`/downloadPortfolio/${portfolioid}`, JSON.stringify(0))
                              router.push(`/downloadPortfolio/${portfolioid}`)
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto",
                              display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}>
                              <GetAppIcon style={IconStyle} /><p>Download Portfolio</p>
                            </button>

                            <button onClick={() => {
                              // setShareDrawerOpen(true)
                              // setShareDrawerOpenReload(true)
                              // navigator.clipboard.writeText(`${window.location.href}`);
                              unsecuredCopyToClipboard(window.location.href)
                              enqueueSnackbar('Link Copied', { variant: 'success', autoHideDuration: 2000 });
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}>
                              <ShareIcon style={IconStyle} /><p>Share your portfolio</p>
                            </button>

                            <button onClick={() => {
                              setStyleDrawerOpen(true)
                              setTimeout(() => {
                                console.log('kkkuuu');
                                if (states.styleDrawer === false) {
                                  actions.setStyleDrawer(true)
                                }
                              }, 500)
                              setStyleDrawerOpenReload(true)
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}>
                              <StyleIcon style={IconStyle} /><p>Style your portfolio</p>
                            </button>

                            <button
                              onClick={() => { router.push(`/slideShow/${portfolioid}`) }}
                              style={{
                                background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                              }}
                            ><PlayArrowIcon style={IconStyle} /><p>Play Slideshow</p>
                            </button>
                            <button style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}
                              onClick={() => {
                                if (portfolioDetails.userSlug !== loggedinSlug) {
                                  enqueueSnackbar("No Access!", { variant: 'error', autoHideDuration: 2000 })
                                  return
                                }
                                router.push(`/editPortfolio/${portfolioid}`)
                                localStorage.setItem('coverImageLength', JSON.stringify(portfolioDetails?.totalPictures))
                                sessionStorage.setItem(`/editPortfolio/${portfolioid}`, JSON.stringify(0))
                                console.log(portfolioDetails.pictures.length);
                              }}>
                              <EditIcon style={IconStyle} />Edit
                            </button>

                            <button onClick={() => {
                              setDeleteDrawerOpen(true)
                              setDeleteDrawerOpenReload(true)
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}
                            // onClick={afterDeletePositionUserInfoSet}
                            ><DeleteIcon style={IconStyle} />Delete
                            </button>
                            <a href={`${process.env['NEXT_PUBLIC_HELP_LINK']}`} target='_blank' rel="noreferrer" style={{ textDecoration: 'none' }}>
                              <button style={{
                                background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                              }}
                              // onClick={afterDeletePositionUserInfoSet}
                              ><FeedbackIcon style={IconStyle} /><p>Feedback</p>
                              </button>
                            </a>
                          </Grid>
                        </Grid >
                      </Grid>
                    </Grid>
                    :
                    <Grid className={drawerOpenReload ? styles['anim'] : styles['displayDrawer']}>
                      <Grid style={{ width: '100%', backgroundColor: states?.color ? states?.color : 'black', color: 'white', borderRadius: '20px' }}>
                        <Grid className={drawerOpenVisibleHide()}>
                          <Grid style={{ paddingTop: '20px', height: '380px', textAlign: 'left' }}>
                            <button onClick={() => {
                              sessionStorage.setItem(`/downloadPortfolio/${portfolioid}`, JSON.stringify(0))
                              router.push(`/downloadPortfolio/${portfolioid}`)
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto",
                              display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}>
                              <GetAppIcon style={IconStyle} /><p>Download Portfolio</p>
                            </button>

                            <button onClick={() => {
                              // setShareDrawerOpen(true)
                              // setShareDrawerOpenReload(true)
                              // navigator.clipboard.writeText(`${window.location.href}`);
                              unsecuredCopyToClipboard(window.location.href)
                              enqueueSnackbar('Link Copied', { variant: 'success', autoHideDuration: 2000 });
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}>
                              <ShareIcon style={IconStyle} /><p>Share your portfolio</p>
                            </button>

                            <button onClick={() => {
                              setStyleDrawerOpen(true)
                              setTimeout(() => {
                                console.log('kkkuuu');
                                if (states.styleDrawer === false) {
                                  actions.setStyleDrawer(true)
                                }
                              }, 500)
                              setStyleDrawerOpenReload(true)
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}>
                              <StyleIcon style={IconStyle} /><p>Style your portfolio</p>
                            </button>

                            <button
                              onClick={() => { router.push(`/slideShow/${portfolioid}`) }}
                              style={{
                                background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                              }}
                            ><PlayArrowIcon style={IconStyle} /><p>Play Slideshow</p>
                            </button>
                            <button style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}
                              onClick={() => {
                                if (portfolioDetails.userSlug !== loggedinSlug) {
                                  enqueueSnackbar("No Access!", { variant: 'error', autoHideDuration: 2000 })
                                  return
                                }
                                router.push(`/editPortfolio/${portfolioid}`)
                                localStorage.setItem('coverImageLength', JSON.stringify(portfolioDetails?.totalPictures))
                                sessionStorage.setItem(`/editPortfolio/${portfolioid}`, JSON.stringify(0))
                                console.log(portfolioDetails.pictures.length);
                              }}>
                              <EditIcon style={IconStyle} />Edit
                            </button>

                            <button onClick={() => {
                              setDeleteDrawerOpen(true)
                              setDeleteDrawerOpenReload(true)
                            }} style={{
                              background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                            }}
                            // onClick={afterDeletePositionUserInfoSet}
                            ><DeleteIcon style={IconStyle} />Delete
                            </button>
                            <a href={`${process.env['NEXT_PUBLIC_HELP_LINK']}`} target='_blank' rel="noreferrer" style={{ textDecoration: 'none' }}>
                              <button style={{
                                background: 'none', border: 'none', color: 'white', fontSize: '18px', marginBottom: '3px', width: '100%', textAlign: 'left', padding: '11px 6px 11px 12%', cursor: 'pointer', pointerEvents: deleteDrawerOpen || styleDrawerOpen ? "none" : "auto", display: 'flex', flexDirection: 'row', alignItems: 'center', height: '45px'
                              }}
                              // onClick={afterDeletePositionUserInfoSet}
                              ><FeedbackIcon style={IconStyle} /><p>Feedback</p>
                              </button>
                            </a>
                          </Grid>
                        </Grid >
                      </Grid>
                    </Grid>
                }
                {/* {
                  shareDrawerOpen ?
                    <Grid className={styles['anim2Grow']} >
                      <Grid style={{ width: '100%', color: 'black', backgroundColor: 'white', borderRadius: '20px' }}>
                        <Grid style={{ paddingTop: '20px', height: '380px' }}>
                          <ShareMenu url={url} />
                        </Grid>
                      </Grid >
                    </Grid>
                    :
                    <Grid
                      className={shareDrawerOpenReload ?
                        // styles['anim2'] :
                        '' : styles['displayDrawer']
                      }
                    >
                      <Grid style={{ width: '100%', color: 'black', backgroundColor: 'white', borderRadius: '20px' }}>
                        <Grid style={{ paddingTop: '20px', height: '380px' }}>
                          <ShareMenu url={url} />
                        </Grid>
                      </Grid >
                    </Grid>
                } */}
                {
                  styleDrawerOpen ?
                    <Grid className={styles['anim2Grow']} >
                      <Grid style={{ width: '100%', color: 'black', backgroundColor: 'white', borderRadius: '20px' }}>
                        <Grid style={{ paddingTop: '20px', height: '380px' }}>
                          <PortfolioMenu handleClose={handleClose}
                          />
                        </Grid>
                      </Grid >
                    </Grid>
                    :
                    <Grid className={styleDrawerOpenReload ? styles['anim2'] : styles['displayDrawer']}>
                      <Grid style={{ width: '100%', color: 'black', backgroundColor: 'white', borderRadius: '20px' }}>
                        <Grid style={{ paddingTop: '20px', height: '380px' }}>
                          <PortfolioMenu handleClose={handleClose} />
                        </Grid>
                      </Grid >
                    </Grid>
                }
                {
                  deleteDrawerOpen ?
                    <Grid className={styles['anim2Grow']} >
                      <Grid style={{ width: '100%', color: 'black', backgroundColor: 'white', borderRadius: '20px' }}>
                        <Grid style={{ paddingTop: '20px', height: '380px' }}>
                          <DeleteMenu afterDeletePosition={afterDeletePositionUserInfoSet} setDeleteDrawerOpen={setDeleteDrawerOpen} deleteDrawerOpen={deleteDrawerOpen} />
                        </Grid>
                      </Grid >
                    </Grid>
                    :
                    <Grid className={deleteDrawerOpenReload ? styles['anim2'] : styles['displayDrawer']}>
                      <Grid style={{ width: '100%', color: 'black', backgroundColor: 'white', borderRadius: '20px' }}>
                        <Grid style={{ paddingTop: '20px', height: '380px' }}>
                          <DeleteMenu
                          />
                        </Grid>
                      </Grid >
                    </Grid>
                }
              </Grid>

            </div >
          </Grid>
        </motion.div >
        :
        <Grid>
          <Grid>
            <Skeleton variant="rect" style={{ marginTop: '5px', width: '25%', height: '40px' }} />
            <Skeleton variant="rect" style={{ marginTop: '10px', width: '50%', height: '15vh' }} />
            {/* <Skeleton variant="rect" style={{ marginTop: '5px', width: '60%', height: '4vh' }} /> */}
            <Skeleton variant="rect" style={{ marginTop: '20px', width: '100%', height: '80vh' }} />
          </Grid>
        </Grid>
      }

    </Grid >
  );

}

export default Portfolioid;



