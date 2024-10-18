import React, { useEffect, useState } from 'react'
import { Grid, Skeleton } from '@mui/material';
import UserAccent from '../../components/UserAccent/UserAccent';
import UserFaq from '../../components/UserFaq/UserFaq';
// import Logout from '../components/Helpers/Logout/Logout';
import KeyboardSpaceBackIcon from '../../components/Helpers/KeyboardSpaceBackIcon';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
import { useSnackbar } from 'notistack';
import UserDetails from '../../components/UserDetails/UserDetails';
import { IUser } from '../../interfaces/dataInterface';
import { ArtPortfolioOtherApiServer } from '../../src/Others/ArtPortfolioOtherApiServer';
import LongButton from '../../components/Buttons/LongButton';
import { SocialLogin } from '../../components/Helpers/SocialLogin';
import { CookiesHandler } from '../../components/Helpers/CookiesHandler';
import { useRouter } from 'next/dist/client/router';

function UserDetailsPage() {

  const actions = useActions();
  const states = useAppState();
  const [data, setData] = useState<Partial<IUser>>({});
  // const [dataUpdate, setDataUpdate] = useState<Partial<IUser>>({});
  const [imgPath, setImgPath] = useState<File | null>(null)
  const [skeleton, setSkeleton] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { userDetailsId } = router.query;
  const loggedinSlug = CookiesHandler.getSlug();


  const userDetail = async (userDetailsId: string | undefined) => {
    if (!userDetailsId) {
      return
    }
    const { res, err } = await ArtPortfolioServer.getProfileData(userDetailsId)
    if (err) {
      enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
    }
    else {
      actions.setUserInfo(res.userDetails)
      setData(res.userDetails);
      // setDataUpdate(res.userDetails)
      actions.setPortfolioNumber(res.totalPortfolios)
      actions.setPictureNumber(res.totalPictures);
      setSkeleton(false)

      //after reload position set fix
      //UD = USER DETAILS
      const portfolioPositionBeforeUD = localStorage.getItem('beforeGoingUserDetailsWhichPosition');
      const countPortfolioP = localStorage.getItem('countPortfolioPage');

      if (!portfolioPositionBeforeUD || !countPortfolioP) {
        return
      }
      actions.setCountPortfolioPage(parseInt(countPortfolioP.toString()))
      actions.positionSet(parseInt(portfolioPositionBeforeUD.toString()) - 1);

      // const getsrollySession = sessionStorage.getItem(window.location.pathname ?? 0)
      // if (!getsrollySession) {
      //   return
      // }
      // setTimeout(() => {
      //   window.scroll(0, parseInt(getsrollySession))
      // }, 1500)
    }
  }


  useEffect(() => {
    userDetail(userDetailsId as string)
  }, [userDetailsId])

  useEffect(() => {
    SocialLogin.initFirebase()
  }, [])

  const handleLogout = async () => {
    await SocialLogin.logOut();
    CookiesHandler.removeAccessToken();
    actions.positionSet(0)
    localStorage.clear();
    sessionStorage.clear();
    // router.push('/login')
    window.location.href = "/login"
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field: string = e.target.name;
    const value: string = e.target.value;
    const obj: { [key: string]: string } = {}
    obj[field] = value

    setData({
      ...data,
      ...obj
    })
  }


  // const handleApiHit =(allProfileData: Partial<IUser>) => {
  //   const keys = Object.keys(allProfileData)
  //   console.log('dataaUpdate', dataUpdate)
  //   console.log('allportfoliodata', allProfileData)
  //   for (const key of keys) {
  //     if (allProfileData?.[key as keyof typeof allProfileData]?.toString() !== dataUpdate[key as keyof typeof dataUpdate]?.toString()) {
  //       return false
  //     }
  //   }       
  //       return true
  //   }

  const postProfile = async (allProfileData: Partial<IUser>) => {
    // const bool = handleApiHit(allProfileData)
    // console.log('booool', bool)
    // if (!bool) {
    const { err } = await ArtPortfolioServer.updateProfile(allProfileData)
    if (err) {
      enqueueSnackbar(isNaN(err as number) ? err as string : 'Server Error', { variant: 'error', autoHideDuration: 2000 });
    }
    else {
      window.smartlook('track', 'User Update His Profile')
      enqueueSnackbar('Profile Updated', { variant: 'success', autoHideDuration: 2000 });
    }
    // }
    // else {
    //   enqueueSnackbar('No Changes', { variant: 'warning', autoHideDuration: 2000 });
    // }
  }
  const handleSubmit = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (imgPath) {
      // const imgData = new FormData();
      // imgData.set("key", "11b44d46ea6e3a1cff61f7cabe71c172")
      // imgData.append("image", imgPath)
      // axios.post('https://api.imgbb.com/1/upload', imgData)
      const { err, res } = await ArtPortfolioOtherApiServer.uploadOneImageToImgbb(imgPath)
      if (err) {
        //
      }
      else {
        if (!res?.data?.data?.url) {
          return
        }
        const allProfileData = {
          ...data,
          avatar: res.data.data.display_url,
          color: states.userInfo?.color
        }
        console.log('gg', allProfileData)
        postProfile(allProfileData)
        // setDataUpdate(allProfileData)
      }

    }
    else {

      const allProfileData = {
        ...data,
        color: states.userInfo?.color


      }
      console.log('ggf', allProfileData)
      await postProfile(allProfileData)
      // setDataUpdate(allProfileData)

    }


  }




  return (
    <>
      {
        skeleton == false && states.userInfo?.avatar ?
          <Grid >
            <Grid style={{
              display: 'flex',
            }}>
              <KeyboardSpaceBackIcon simplified={true} windowPathName={window.location.pathname}
              // handleSubmit={handleSubmit} userDetail={true}
              />
            </Grid>
            {/* {
              states.userInfo ? */}
            <Grid style={{ position: 'relative', top: '45px', paddingBottom: '5px' }}>
              {/* <form onSubmit={handleSubmit} > */}
              <UserDetails handleOnChange={handleOnChange} setImgPath={setImgPath} data={data} loggedinSlug={loggedinSlug} userDetailsId={userDetailsId} />
              <UserAccent />
              <UserFaq />
              <div style={{ padding: 0.1 }}>

              </div>
              {
                userDetailsId === loggedinSlug && <LongButton
                  title='Save changes'
                  path="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"
                  onClick={async (e) => {
                    handleSubmit(e)
                  }}
                />
              }
              <a href={`${process.env['NEXT_PUBLIC_HELP_LINK']}`} target='_blank' rel="noreferrer" style={{ textDecoration: 'none' }}>
                <LongButton
                  title='Feedback'
                  path="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"
                />
              </a>
              {
                userDetailsId === loggedinSlug && <LongButton
                  title='Logout'
                  path="M13.34,8.17C12.41,8.17 11.65,7.4 11.65,6.47A1.69,1.69 0 0,1 13.34,4.78C14.28,4.78 15.04,5.54 15.04,6.47C15.04,7.4 14.28,8.17 13.34,8.17M10.3,19.93L4.37,18.75L4.71,17.05L8.86,17.9L10.21,11.04L8.69,11.64V14.5H7V10.54L11.4,8.67L12.07,8.59C12.67,8.59 13.17,8.93 13.5,9.44L14.36,10.79C15.04,12 16.39,12.82 18,12.82V14.5C16.14,14.5 14.44,13.67 13.34,12.4L12.84,14.94L14.61,16.63V23H12.92V17.9L11.14,16.21L10.3,19.93M21,23H19V3H6V16.11L4,15.69V1H21V23M6,23H4V19.78L6,20.2V23Z"
                  onClick={() => {
                    handleLogout()
                  }}
                />
              }

              {/* <Grid style={{
                      width: '50%',
                      margin: '1.5rem auto',
                      textAlign: 'center'
                    }}>
                      <button
                        type="submit"
                        style={{
                          border: 'none',
                          backgroundColor: '#fff',
                          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                          fontFamily: 'Poppins',
                          fontSize: '20px',
                          padding: '0.5rem 1.5rem'
                        }}
                      >
                        Submit
                      </button>
                    </Grid> */}

              {/* <Grid className={styles['container']}>
                      HELLO
                    </Grid> */}

              {/* </form > */}
              {/* <Grid style={{
                    margin: '1.5rem auto',
                    textAlign: 'center'
                  }}>
                    <Logout />
                  </Grid> */}
            </Grid>
            {/* : <><p>Loading</p> </>
            } */}

          </Grid > :
          <Grid>
            <Skeleton variant="text" style={{ width: '50px', height: '50px', marginTop: '17px' }} />
            <Skeleton variant="rectangular" style={{
              width: '100%', height: '359px',
              margin: '1rem 0 0',
              borderRadius: '10px'
            }} />
            <Skeleton variant="rectangular" style={{
              width: '100%', height: '201px',
              margin: '1.5rem 0 0',
              borderRadius: '10px'
            }} />
            <Skeleton variant="rectangular" style={{
              width: '100%', height: '260px',
              margin: '1.5rem 0rem 1rem ',
              borderRadius: '10px'
            }} />
          </Grid>
      }
    </>
  )
}

export default UserDetailsPage




