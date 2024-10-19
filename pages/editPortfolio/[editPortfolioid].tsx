import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@mui/styles';
import { Fab, FormControlLabel, Radio, RadioGroup, TextareaAutosize, TextField, Skeleton } from "@mui/material";
import styles from "./editPortfolio.module.css";
import DoneIcon from '@mui/icons-material/Done';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Dropzone from '../../components/Helpers/Dropzone/Dropzone';
import KeyboardSpaceBackIcon from '../../components/Helpers/KeyboardSpaceBackIcon';
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
// import { CookiesHandler } from '../../components/Helpers/CookiesHandler';
import { ArtPortfolioOtherApiServer } from '../../src/Others/ArtPortfolioOtherApiServer';
import { ArtPortfolioServer } from '../../src/Others/ArtPortfolioServer';
import { Splide, SplideSlide } from '@splidejs/react-splide';
// Default theme
import '@splidejs/react-splide/css';
import { useSnackbar } from 'notistack';
import { IPicture, IPortfolio } from '../../interfaces/dataInterface';

interface Props {

}

// const getThemeObj = (theme: Theme) => {
//     return {
//         //    
//     }
// }


// var addedPicturesUrl: Array<string> = [];

const initialYear = new Date().getFullYear() - 30
const min = initialYear + 40
const years = []



for (let i = initialYear; i <= min; i++) {
    years.push(i)

}
const sliderYears = years;

const EditPortfolioid: React.FC<Props> = () => {
    const actions = useActions()
    const states = useAppState()


    const useStyles = makeStyles(() => {
        return {
            // Define your styles here
            avatarSize: {
                width: '60px',
                height: '60px',
                backgroundColor: states.userInfo?.color as string,
                color: 'white',
                position: 'fixed',
                "&:hover": {
                    backgroundColor: states.userInfo?.color as string,
                }
            },


        }
    });

    const classes = useStyles();
    const [files, setFiles] = useState<Array<File>>([]);
    const [filesUrl, setFilesUrl] = useState<Array<string>>([]);
    const [isYearChecked, setYearChecked] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    // const descriptionRef = useRef<HTMLInputElement>(null);
    const noneRef = useRef<HTMLInputElement>(null);
    const [editportfolioDetails, setEditPortfolioDetails] = useState<IPortfolio | null>(null)
    const [portfolioDeletedImgDetails, setPortfolioDeletedImgDetails] = useState<Array<IPicture>>([])
    const [anotherEditportfolioDetails, setAnotherEditportfolioDetails] = useState<IPortfolio | null>(null)
    const [atLeastImage, setAtleastImage] = useState(true);
    const router = useRouter();
    const { editPortfolioid } = router.query;

    const [centerYear, setCenterYear] = useState(0);
    const [coverImage, setCoverImage] = useState<number | string>(0);
    // const [coverImagesArray, setCoverImagesArray] = useState([]);
    const [skeleton, setSkeleton] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    // const [privacy, setPrivacy] = useState('public');

    // var addedPicturesUrl: Array<string> = [];

    useEffect(() => {
        const coverImageNumber = typeof coverImage === 'string' ? parseInt(coverImage, 10) : coverImage;
        if (coverImageNumber > states.coverImagesArray.length - 1) {
            setCoverImage(states.coverImagesArray.length - 1);
        }
    }, [states.coverImagesArray, coverImage]);

    useEffect(() => {
        if (!editportfolioDetails) {
            return
        }
        if (editportfolioDetails?.pictures?.length == 0) {
            setAtleastImage(false)
        }
        else {
            setAtleastImage(true)
        }

    }, [editportfolioDetails])


    const fetchOnePortfolioDetails = async () => {
        if (!editPortfolioid) {
            return
        }
        const { res, err } = await ArtPortfolioServer.getOnePortfolioDetails(editPortfolioid?.toString())
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            setEditPortfolioDetails(res)
            setAnotherEditportfolioDetails(res)
            actions.setPrivacy(res?.privacy)
            actions.setUserColor(res?.color)
            setCoverImage(parseInt(res?.coverImage.toString() ?? "0") - 1)
            // setCoverImage(parseInt(res?.coverImage.toString()) - 1)

            let ind = 0
            sliderYears.forEach((year, index) => {
                if (year as unknown == res?.year) {
                    ind = index;
                }
            })

            setCenterYear(ind)
            setYearChecked(res?.year == 'none' ? true : false)
            setSkeleton(false)
            actions.setCoverImagesArray(new Array(res.pictures.length).fill(1).map((___, index) => { return index + 1 }))
            // const getsrollySession = sessionStorage.getItem(window.location.pathname ?? 0)
            // console.log('scrolledY', getsrollySession)
            // if (!getsrollySession) {
            //     return
            // }
            // setTimeout(() => {
            //     window.scroll(0, parseInt(getsrollySession))
            // }, 1500)
        }
    }
    const updateOnePortfolioDetails = async (onePortfolioData: Partial<IPortfolio>) => {

        console.log('onePortfolio', onePortfolioData);
        const { err } = await ArtPortfolioServer.updateOnePortfolio(onePortfolioData)
        if (err) {
            enqueueSnackbar(isNaN(err as number) ? err as string : 'Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            router.back()
            setTimeout(() => {
                actions.setDialogLoading(false)
                enqueueSnackbar("Portfolio edit successful !", { variant: 'success', autoHideDuration: 2000 })
            }, 1000)

        }
    }

    const userDetails = async () => {
        const { res, err } = await ArtPortfolioServer.getUserInfo()
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            actions.setUserInfo(res.userDetails)
            setSkeleton(false)
        }
    }



    useEffect(() => {
        if (editPortfolioid) {
            userDetails()
            fetchOnePortfolioDetails();
        }
    }, [editPortfolioid])


    const handleCheckboxChange = () => {
        // const isChecked = e.target.checked;
        setYearChecked(!isYearChecked);
    }



    const validate = Yup.object({
        portfolioName: Yup.string()
            .required("Portfolio Name Can't be E"),
        description: Yup.string()
            .required("Description Can't be Empty"),
        // pictures: Yup.string().when('atLeastImage', {   
        //         // eslint-disable-next-line @typescript-eslint/no-explicit-any, arrow-body-style
        //         is: true, 
        //         then: Yup.string().required('Field'),
        //         otherwise: Yup.string().required('fieField is required'),
        //         })

    })

    const yearCondition = (index: number) => {
        if (isYearChecked) {
            return styles['disabledBtn'];
        }
        if (centerYear === index) {
            return styles['selectedButton'];
        }
        return styles['notSelectedButton'];


    }

    const handleNotSubmit = (onePortfolioData: Partial<IPortfolio>) => {
        console.log('dd', onePortfolioData.pictures);
        const keys = Object.keys(onePortfolioData)
        const pictureLength = onePortfolioData?.pictures?.length || 0;
        console.log('hhhhqqq', pictureLength)
        for (const key of keys) {
            if (key === 'pictures') {
                continue;
            }
            if (anotherEditportfolioDetails?.[key as keyof typeof anotherEditportfolioDetails]?.toString() !== onePortfolioData[key as keyof typeof onePortfolioData]?.toString()) {
                return false
            }
            if (pictureLength !== anotherEditportfolioDetails?.pictures.length) {
                return false
            }
        }

        for (let i = 0; i < pictureLength; i++) {
            console.log('oo', onePortfolioData?.pictures?.[i].serial, anotherEditportfolioDetails?.pictures[i].serial);
            if (onePortfolioData?.pictures?.[i].url !== anotherEditportfolioDetails?.pictures[i].url) {
                console.log('oo', onePortfolioData?.pictures?.[i].serial);
                return false
            }
        }
        return true
    }

    return (
        <div>
            {
                anotherEditportfolioDetails && anotherEditportfolioDetails?.pictures?.length > 0 && skeleton == false ?
                    <Formik
                        // enableReinitialize
                        initialValues={{
                            portfolioName: editportfolioDetails?.name,
                            description: editportfolioDetails?.description,
                            year: sliderYears[centerYear],
                            privacy: states.privacy,
                            coverImage: states.coverImagesArray[parseInt(coverImage.toString())],
                            pictures: editportfolioDetails?.pictures
                            // image: portfolioDeletedImgDetails.length == editportfolioDetails.pictures.length,
                        }}
                        validationSchema={validate}
                        onSubmit={async values => {
                            if (atLeastImage) {
                                // setSubmitOnce(true)
                                if (editportfolioDetails?.pictures?.length === 0) {
                                    setAtleastImage(false)
                                    return
                                }
                                setAtleastImage(true)
                                const picturesWhole = editportfolioDetails?.pictures

                                if (picturesWhole) {
                                    for (let i = 0; i < picturesWhole.length; i++) {
                                        if (picturesWhole[i].url.includes("blob")) {
                                            const blob = await fetch(picturesWhole[i].url).then(r => { return r.blob() });
                                            const file = new File([blob], `name${i}`);
                                            // var res = await ArtPortfolioOtherApiServer.uploadOneImageToImgbb(file)
                                            // console.log(`Uploaded: ${res}`)


                                            const { err, res } = await ArtPortfolioOtherApiServer.uploadOneImageToImgbb(file)
                                            if (err) {
                                                //
                                            }
                                            else {
                                                if (!res?.data?.data?.url) {
                                                    return
                                                }
                                                console.log('resultnew', res?.data?.data?.url)
                                                picturesWhole[i] = {
                                                    ...picturesWhole[i],
                                                    url: res?.data?.data?.url,
                                                    added: true
                                                }
                                            }
                                        }
                                    }
                                }



                                // localStorage.setItem('coverImageLength', )


                                // const name = nameRef.current.value;
                                // const description = descriptionRef.current.value;

                                // from here
                                const name = values.portfolioName;
                                const description = values.description;
                                const year = sliderYears[centerYear];//year not able to take yearRef rest of all possible
                                const privacy = states.privacy;
                                // const coverImage = coverImage + 1;
                                const none = noneRef?.current?.checked;
                                // console.log("FFF1")
                                // console.log(editportfolioDetails.ImgbbImageUpload)

                                for (let i = 0; i < portfolioDeletedImgDetails.length; i++) {
                                    if (picturesWhole) {
                                        picturesWhole.push({
                                            ...portfolioDeletedImgDetails[i],
                                            deleted: true
                                        })
                                    }

                                    // console.log("PO")
                                    // console.log({
                                    //     ...portfolioDeletedImgDetails[i],
                                    //     deleted: true
                                    // })
                                }

                                console.log("FFF")
                                console.log('picturesWhole', picturesWhole)

                                const onePortfolioData: Partial<IPortfolio> = {
                                    name: name, description: description, year: none == false ? year : 'none', privacy: privacy, coverImage: parseInt(coverImage.toString()) + 1, pictures: picturesWhole, slug: editPortfolioid?.toString()
                                }
                                if (!editportfolioDetails) {
                                    return;
                                }
                                actions.setDialogLoading(true)
                                if (handleNotSubmit(onePortfolioData)) {
                                    router.back()
                                    setTimeout(() => {
                                        actions.setDialogLoading(false)
                                        enqueueSnackbar('No Changes', { variant: 'warning', autoHideDuration: 2000 });
                                    }, 1000)

                                    return
                                }

                                updateOnePortfolioDetails(onePortfolioData)

                            }
                        }
                        }
                    >
                        {
                            ({
                                values,
                                handleChange,
                                // handleBlur,
                                handleSubmit

                            }) => {
                                return (
                                    <div>
                                        <KeyboardSpaceBackIcon simplified={false} windowPathName={window.location.pathname} />
                                        <div className={styles['container']}>
                                            <form onSubmit={(e) => { e.preventDefault() }} className={styles['form']}
                                            >
                                                <div className="portfolioTitle">
                                                    <label htmlFor='portfolioName'></label>
                                                    <TextField
                                                        variant='standard'
                                                        name="portfolioName"
                                                        type="text"
                                                        value={values.portfolioName}
                                                        onChange={handleChange}
                                                        // onBlur={handleBlur}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            style: { color: states.userInfo?.color, fontFamily: 'Bebas Neue', fontSize: '40px', margin: '25px 0', width: '100vw', wordWrap: 'break-word' }
                                                        }}
                                                        multiline={true}
                                                        inputProps={{
                                                            maxLength: 25
                                                        }}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: 0,
                                                            }
                                                        }}
                                                        inputRef={nameRef}
                                                    />
                                                    <ErrorMessage component='div' className={styles['error']} name="portfolioName" />

                                                </div>
                                                <div className={styles['description']}>
                                                    <label htmlFor='description'>DESCRIPTION</label>
                                                    <TextareaAutosize
                                                        onChange={handleChange}
                                                        // onBlur={handleBlur}
                                                        value={values.description}
                                                        name="description"
                                                        maxLength={300}
                                                    />
                                                    <ErrorMessage component='div' className={styles['error']} name="description" />
                                                </div>
                                                <div className={styles['yearContainer']}>
                                                    <div className={styles['year']}>
                                                        <label id={styles['year']}>YEAR</label>
                                                        <div className={styles['checkboxContainer']}>
                                                            <input type="checkbox" id="check" style={{ accentColor: states.userInfo?.color }} checked={isYearChecked}
                                                                onClick={handleCheckboxChange} ref={noneRef} />
                                                            <label htmlFor='check' id={styles['none']}>None</label>
                                                        </div>
                                                    </div>
                                                    {/* { */}
                                                    <div className={styles['yearInput']}>
                                                        {
                                                            sliderYears.length > 0 && (
                                                                <Splide
                                                                    options={{
                                                                        perPage: 3,
                                                                        perMove: 1,
                                                                        focus: 'center',
                                                                        arrows: false,
                                                                        pagination: false,
                                                                        gap: '1rem',
                                                                        trimSpace: false,
                                                                        drag: !isYearChecked,
                                                                        start: centerYear ? centerYear : 0,
                                                                        isNavigation: true,

                                                                    }}
                                                                    onMove={(e) => {
                                                                        setCenterYear(e.index);
                                                                    }}

                                                                >
                                                                    {
                                                                        sliderYears.map((year, index) => {
                                                                            return (
                                                                                <SplideSlide className={styles['yearNumbers']} key={index}>

                                                                                    <p className={yearCondition(index)}>{year}</p>

                                                                                    {/* {
                                                                                        isYearChecked ? <p className={styles['disabledBtn']} disabled>{year}</p> : centerYear === index ? <p className={styles['selectedButton']}>{year}</p> : <p className={styles['notSelectedButton']}>{year}</p>
                                                                                    } */}

                                                                                </SplideSlide>
                                                                            )
                                                                        })
                                                                    }
                                                                </Splide>
                                                            )
                                                        }

                                                    </div>
                                                    {/* } */}
                                                </div>
                                                <div className={styles['privacy']}>
                                                    <label>Privacy</label>
                                                    <RadioGroup value={states.privacy}
                                                        className={styles['privacyOptions']}
                                                        onChange={(e) => {
                                                            actions.setPrivacy(e.target.value);
                                                        }}
                                                    >
                                                        <FormControlLabel value='public' control={<Radio style={{ color: `${states?.userInfo?.color}` }} />} label="Public" />
                                                        <FormControlLabel value='private' control={<Radio style={{ color: `${states?.userInfo?.color}` }} />} label="Private" />
                                                    </RadioGroup>

                                                </div>
                                                <div className={styles['coverImageContainer']}>
                                                    <label>COVER IMAGE</label>
                                                    <div className={styles['coverImagesInput']}>
                                                        {
                                                            states.coverImagesArray.length > 0 &&
                                                            <Splide
                                                                options={{
                                                                    perPage: 3,
                                                                    perMove: 1,
                                                                    focus: 'center',
                                                                    arrows: false,
                                                                    pagination: false,
                                                                    gap: '1rem',
                                                                    trimSpace: false,
                                                                    start: parseInt(coverImage.toString()) ? parseInt(coverImage.toString()) : 0,
                                                                    isNavigation: true,

                                                                }}
                                                                onMove={(e) => {
                                                                    setCoverImage(e.index);
                                                                }}
                                                            >
                                                                {
                                                                    states.coverImagesArray.map((imagePostion, index) => {
                                                                        return (
                                                                            <SplideSlide key={index} className={styles['coverImagesNumber']}>
                                                                                {
                                                                                    coverImage == index ? <p className={styles['selectedButton']}>{imagePostion}</p> : <p className={styles['notSelectedButton']}>{imagePostion}</p>
                                                                                }
                                                                            </SplideSlide>
                                                                        )
                                                                    })
                                                                }
                                                            </Splide>
                                                        }
                                                    </div>
                                                </div>
                                                <div className={styles['picturesContainer']}>
                                                    <>
                                                        <label>Pictures</label>
                                                        <p style={{ display: "inline-block", marginLeft: '10px' }}>(32MB limit)</p>
                                                        {/* {portfolioDeletedImgDetails.length == anotherEditportfolioDetails.pictures.length && files.length == 0 ? () => {
                                                            console.log('heeeel')
                                                            setAtleastImage(false)
                                                        } : () => {
                                                            console.log('lelele')
                                                            setAtleastImage(true)
                                                        }} */}
                                                        {/* {editportfolioDetails?.pictures?.length === 0 ?
                                                            
                                                                setAtleastImage(false)
                                                            
                                                            :  
                                                                setAtleastImage(true)
                                                            
                                                        } */}
                                                        {atLeastImage == false ? <p className={styles['error']}>At least one image required</p> : ''}
                                                    </>
                                                    {/* <ErrorMessage component='div' className={styles['error']} name="pictures" /> */}
                                                    {/* {states.rejectedFiles > 0 ? <Alert severity="error">{states.rejectedFiles} picture rejected for over limit </Alert> : ''} */}
                                                    {/* {states.selectedFiles.length == 0 ? <p>At Least One Image Required </p> : ''} */}

                                                    <>
                                                        <Dropzone

                                                            files={files}
                                                            setFiles={setFiles}
                                                            filesUrl={filesUrl}
                                                            setFilesUrl={setFilesUrl}
                                                            editportfolioDetails={editportfolioDetails}
                                                            setEditPortfolioDetails={setEditPortfolioDetails}
                                                            portfolioDeletedImgDetails={portfolioDeletedImgDetails}
                                                            setPortfolioDeletedImgDetails={setPortfolioDeletedImgDetails}

                                                        // setAtleastImage={setAtleastImage}
                                                        />

                                                    </>
                                                </div>
                                                <div
                                                // className={styles.favIcon}
                                                >
                                                    <>
                                                        <Fab color="primary" aria-label="add"
                                                            style={{
                                                                position: 'fixed', left: '50%', transform: 'translate(-50%, 0%)', bottom: '55px'
                                                            }}
                                                            classes={{ root: classes.avatarSize }} onClick={() => {
                                                                {
                                                                    // setSubmitOnce(true)
                                                                    handleSubmit()
                                                                }
                                                            }}>
                                                            <DoneIcon />
                                                        </Fab>
                                                    </>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                )
                            }
                        }
                    </Formik >
                    :
                    <div>
                        <div>

                            <Skeleton variant="rectangular" style={{ marginTop: '5px', width: '20%', height: '40px' }} />
                            <Skeleton variant="rectangular" style={{ marginTop: '25px', width: '50%', height: '40px' }} />
                            <Skeleton variant="rectangular" style={{ marginTop: '25px', width: '100%', height: '60px' }} />
                            <Skeleton variant="rectangular" style={{ marginTop: '25px', width: '100%', height: '80px' }} />
                            <Skeleton variant="rectangular" style={{ marginTop: '25px', width: '100%', height: '60px' }} />
                            <Skeleton variant="rectangular" style={{ marginTop: '25px', width: '100%', height: '250px' }} />
                        </div>
                    </div>

            }
        </div >
    )

}

export default EditPortfolioid;




