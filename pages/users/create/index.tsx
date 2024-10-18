import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles';
import { Fab, Grid, TextareaAutosize, Typography, FormControlLabel, TextField, RadioGroup, Radio } from "@mui/material";
import { useActions, useAppState } from '../../../src/Overmind/OvermindHelper';
import styles from './styles.module.css';
import DropzoneCreate from '../../../components/Helpers/DropzoneCreate/DropzoneCreate';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { ArtPortfolioServer } from '../../../src/Others/ArtPortfolioServer';
import { ArtPortfolioOtherApiServer } from '../../../src/Others/ArtPortfolioOtherApiServer';
import { Splide, SplideSlide } from '@splidejs/react-splide';
// Default theme
import '@splidejs/react-splide/css';
import { Skeleton } from "@mui/material";
import { dataCreate } from '../../../interfaces/dataInterface';




interface Props {

}

const initialYear = new Date().getFullYear() - 30
const min = initialYear + 40
const years: Array<number> = []

for (let i = initialYear; i <= min; i++) {
    // console.log(min)
    years.push(i)

}
const sliderYears = years;

const Index: React.FC<Props> = () => {
    // Hooks
    const actions = useActions();
    const states = useAppState();
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [yearVisible, setYearVisible] = useState(false);
    const [files, setFiles] = useState<Array<File>>([]);
    const [filesUrl, setFilesUrl] = useState<Array<string>>([]);
    // const [link, setLink] = useState();
    // const desRef = useRef();
    // const noneRef = useRef();
    const noneRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const [centerYear, setCenterYear] = useState(30);
    const { enqueueSnackbar } = useSnackbar();


    const useStyles = makeStyles((theme) => {
        return {
            // Define your styles here
            avatarSize: {
                width: '60px',
                height: '60px',
                backgroundColor: states.userInfo?.color,
                color: 'white',
                position: 'fixed',
                "&:hover": {
                    backgroundColor: states.userInfo?.color
                }
            },
            root: {
                display: 'flex',
                height: '100%',
                '& > * + *': {
                    marginLeft: 2,
                },
                justifyContent: 'center',
                alignItems: 'center'
            },
            section: {
                position: 'fixed',
                width: '100%',
                height: '38vh',
                '&::before': {
                    content: '" "',
                    position: 'absolute',
                    bottom: 0,
                    left: "49%",
                    width: "200vw",
                    height: "100vh",
                    backgroundColor: states.userInfo?.color,
                    borderRadius: "40%",
                    transformOrigin: "bottom",
                    transform: "translate(-50%) scale(.7)"
                }
            },
        }
    });

    const classes = useStyles();



    const imageLinks: Array<string> = [];

    const handleImageUpload = async (file: File) => {
        const { res, err } = await ArtPortfolioOtherApiServer.uploadOneImageToImgbb(file)
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
            setTimeout(() => {
                actions.setDialogLoading(false)
            }, 1000)
        }
        else {
            // setLink(res?.data?.data?.display_url)
            imageLinks.push(res?.data?.data?.display_url as string)
        }
        // setLink(res)
        // //@ts-ignore
        // imageLinks.push(res)
        // console.log('image Link', imageLinks)
    }

    const handleCheckboxChange = (e: boolean) => {
        // const isChecked = e.target.checked;
        setYearVisible(e);
    }

    const userDetails = async () => {
        const { res, err } = await ArtPortfolioServer.getUserInfo()
        if (err) {
            enqueueSnackbar('Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            // const loaded = localStorage.getItem('localLoadedPortfolio');
            // if (!loaded) {
            //     return
            // }
            // const loadedPortfolios: Array<IPortfolio> = JSON.parse(loaded)

            // // const loadedPortfolios = localStorage.getItem('localLoadedPortfolio');
            // actions.setLoadedPortfolio(loadedPortfolios)
            actions.setUserInfo(res.userDetails)
            const portfolioNumBefCreatePageGoing = localStorage.getItem('beforeGoingCreateWhichPosition')
            const countPortfolioP = localStorage.getItem('countPortfolioPage');
            if (!portfolioNumBefCreatePageGoing || !countPortfolioP) {
                return
            }
            const pNumberBefCreatePGo = parseInt(portfolioNumBefCreatePageGoing)
            actions.positionSet(pNumberBefCreatePGo - 1);

            const countPortfolioPage: string = JSON.parse(countPortfolioP)
            actions.setCountPortfolioPage(parseInt(countPortfolioPage))
        }
    }

    useEffect(() => {
        userDetails()

    }, [])

    const yearCondition = (index: number) => {
        if (yearVisible) {
            return styles['disabledBtn'];
        }
        if (centerYear === index) {
            return styles['selectedButton'];
        }
        return styles['notSelectedButton'];
    }

    const onSubmit = async (data: dataCreate) => {
        // setLoading(true);
        actions.setDialogLoading(true)
        console.log(data)

        console.log("SFFF")
        console.log(files)
        // console.log(img)
        for (let i = 0; i < files.length; i++) {
            await handleImageUpload(files[i])
        }
        console.log("DONE")
        console.log(imageLinks)
        console.log(imageLinks.join(' '))


        const name = data.name ?? "";
        const description = data.description ?? "";
        const none = noneRef.current.checked;
        const year = sliderYears[centerYear];
        const privacy = data.privacy;
        const picture = imageLinks.join(' ');

        console.log(name);
        console.log(description);
        console.log(none);
        console.log(year);
        console.log(picture);

        console.log('hitting');
        // name, description, none == false ? year : 'none', privacy, picture
        const hello =
        {
            name: name,
            description: description,
            year: none == false ? year.toString() : 'none',
            privacy: privacy, picture: picture
        }
        console.log('yeeeeee', hello)
        if (!privacy) {
            return
        }
        const { err } = await ArtPortfolioServer.createPortfolio({ name: name, description: description, year: none == false ? year.toString() : 'none', privacy: privacy, picture: picture })
        if (err) {
            enqueueSnackbar(isNaN(err as number) ? err as string : 'Server Error', { variant: 'error', autoHideDuration: 2000 });
            setTimeout(() => {
                actions.setDialogLoading(false)
            }, 1000)
        }
        else {
            router.push(`/users/${states.userInfo?.slug}`)
            setTimeout(() => {
                actions.setDialogLoading(false)
            }, 1000)
            enqueueSnackbar("Portfolio create successful !", { variant: 'success', autoHideDuration: 2000 })
        }

    };

    // Funcs

    // Vars

    // JSX

    return (
        <Grid>
            {
                states.userInfo?.color ?
                    <Grid>
                        <Grid className={styles['sec']} classes={{ root: classes.section }}>

                        </Grid>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid
                                className={styles['container']}
                            >
                                <Grid className={styles['content']}>
                                    <Typography className={styles['portfolioText']}

                                    >Create<span style={{ display: 'block' }}>Portfolio</span> </Typography>
                                </Grid >
                                <Grid className={styles['container1']}>
                                    <Grid className={styles['containAll']}>
                                        <Grid className={styles['name']}>
                                            <label>Name</label>
                                            <TextField InputProps={{ disableUnderline: true, style: { color: "black" } }}
                                                inputProps={{
                                                    maxLength: 30
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: 0,
                                                    }
                                                }}
                                                {...register('name', { required: 'required' })}
                                            />
                                            {errors['name'] && <span className={styles['error']}>{errors['name'].message?.toString()}</span>}
                                        </Grid>
                                        <Grid className={styles['description']}>
                                            <label>DESCRIPTION</label>
                                            <TextareaAutosize style={{ fontSize: '20px !important' }}
                                                // ref={desRef}
                                                maxLength={300}
                                                {...register('description', { required: 'required' })}
                                            />
                                            {errors['description'] && <span className={styles['error']}>{errors['description'].message?.toString()}</span>}
                                        </Grid>
                                        <Grid className={styles['yearContainer']}>
                                            <Grid className={styles['year']}>
                                                <label id={styles['year']}>YEAR</label>
                                                <Grid className={styles['checkboxContainer']}>
                                                    <input type="checkbox" id="check" style={{ accentColor: states.userInfo?.color }} onClick={() => { handleCheckboxChange(!yearVisible as boolean) }} ref={noneRef} />
                                                    <label htmlFor='check' id={styles['none']}>None</label>
                                                </Grid>
                                            </Grid>
                                            <Grid className={styles['yearInput']}>
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
                                                                drag: !yearVisible,
                                                                start: centerYear ? centerYear : 30,
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
                                                                                        yearVisible ?
                                                                                        <p disabled>{year}</p> :
                                                                                        centerYear === index ?
                                                                                        <p style={{ color: 'black', fontSize: '18.5px' }}>{year}</p> :
                                                                                        <p style={{ color: 'grey' }}>{year}</p>
                                                                                    } */}

                                                                        </SplideSlide>
                                                                    )
                                                                })
                                                            }
                                                        </Splide>
                                                    )
                                                }

                                            </Grid>
                                        </Grid>
                                        <Grid className={styles['privacy']}>
                                            <label>Privacy</label>
                                            <RadioGroup
                                                className={styles['privacyOptions']}
                                                defaultValue="public"
                                            >
                                                <FormControlLabel  {...register("privacy")} value='public' control={<Radio style={{ color: `${states.userInfo.color}` }} />} label="Public" />
                                                <FormControlLabel  {...register("privacy")} value='private' control={<Radio style={{ color: `${states.userInfo.color}` }} />} label="Private" />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className={styles['picture']}>
                                            <label>picture</label>

                                            {files.length == 0 ? <> <p {...register('im', { required: 'At least one image required' })} />
                                                {errors['im'] && <span className={styles['error']}>{errors['im'].message?.toString()}</span>}
                                            </> : ''}
                                        </Grid>
                                        <Grid className={styles['contain']}>
                                            <DropzoneCreate
                                                files={files}
                                                setFiles={setFiles}
                                                filesUrl={filesUrl}
                                                setFilesUrl={setFilesUrl}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>

                            <Grid className={styles['favIcon']}>
                                <Fab color="primary" type='submit' aria-label="add" classes={{ root: classes.avatarSize }}>
                                    <DoneIcon />
                                </Fab>
                            </Grid>
                        </form>

                        <Grid className={styles['favIconDone']} onClick={() => { sessionStorage.setItem('/users/create', JSON.stringify(0)) }}>
                            <Link href={`${states.userInfo.slug}`}>
                                <ClearIcon style={{ fontSize: '30px', color: 'white' }} />
                            </Link>
                            {/* <Fab color="primary" aria-label="add" classes={{ root: classes.avatarSize }} onClick={() => router.push(`/users/${states.userInfo.slug}`)}><ClearIcon /></Fab> */}
                        </Grid>
                    </Grid >
                    :
                    <Grid>
                        <Grid>
                            <Skeleton variant="rectangular" style={{ width: '100%', height: '98vh' }} />
                        </Grid>
                    </Grid>

            }
        </Grid >
    )

}

export default Index;



