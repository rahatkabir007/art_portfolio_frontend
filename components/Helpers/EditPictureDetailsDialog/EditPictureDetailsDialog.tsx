import React, { Dispatch } from 'react'
import { makeStyles } from '@mui/styles';
import { Fab, Grid, TextareaAutosize, TextField } from "@mui/material";
import { useActions, useAppState } from '../../../src/Overmind/OvermindHelper';
import styles from './EditPictureDetailsDialog.module.css';
import Dialog from '@mui/material/Dialog';
import { useForm } from 'react-hook-form';
import DoneIcon from '@mui/icons-material/Done';
import { ArtPortfolioServer } from '../../../src/Others/ArtPortfolioServer';
import { useSnackbar } from 'notistack';
import { IUpdateImg } from '../../../interfaces/dataInterface';

interface Props {
    open: boolean,
    setOpen: Dispatch<boolean>,
    currentIndex: number,
    simplified?: boolean,
}

interface onSubmitData {
    mainTitle?: string
    name?: string
    description?: string
}

// interface IUpdateImg {
//     imageDetailsid: string,
//     name: string ,
//     description: string,
//     url: string
// }


const EditPictureDetailsDialog: React.FC<Props> = (props) => {
    const actions = useActions()
    const states = useAppState()
    const {
        open, setOpen, currentIndex, simplified
        // imageDetailsid, pictureDetail, setPictureDetail, simplified, portfolio, setStateChange, setPortfolioDetails, portfolioid, portfolioUpdate
    } = props;
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ reValidateMode: "onSubmit" });



    const useStyles = makeStyles(() => {
        return {
            // Define your styles here
            paper: {
                minWidth: simplified ? '85%' : '85%',
                // minHeight: '32%',
                borderRadius: '30px'
            },
            avatarSize: {
                width: '50px',
                height: '50px',
                backgroundColor: states?.userInfo?.color,
                color: 'white',
                "&:hover": {
                    backgroundColor: states?.userInfo?.color
                }
            },
        }
    });


    // Funcs

    // Vars

    // JSX
    const classes = useStyles();

    const handleClose = () => {
        if (!setOpen) {
            return
        }
        setOpen(false)
        setTimeout(() => {

            reset()
        }, 500)
    };

    const updateImage = async (obj: IUpdateImg) => {
        const { err } = await ArtPortfolioServer.updateImageDetails(obj)
        if (err) {
            enqueueSnackbar(isNaN(err as number) ? err as string : 'Server Error', { variant: 'error', autoHideDuration: 2000 });
        }
        else {
            // setOpen(false);
            handleClose()
            actions.setCurrentImageUpdatedData({
                index: currentIndex,
                picture: {
                    name: obj.name,
                    description: obj.description
                }
            })
        }
    }



    const onSubmit = async (data: onSubmitData) => {

        if (simplified) {
            // const hello=states[mainTitle]
            if (!states?.mainTitle || !states?.userInfo || !data?.mainTitle) {
                return
            }
            if (data.mainTitle && data.mainTitle.toUpperCase() != states?.mainTitle.toUpperCase()) {
                actions.setMainTitle(data.mainTitle);
                actions.setUserInfo({ ...states.userInfo, mainTitle: data.mainTitle })
                const { err } = await ArtPortfolioServer.updateProfile({ mainTitle: states.mainTitle })
                if (err) {
                    enqueueSnackbar(isNaN(err as number) ? err as string : 'Server Error', { variant: 'error', autoHideDuration: 2000 });
                }
                else {
                    enqueueSnackbar('Portfolio Name Updated', { variant: 'success', autoHideDuration: 2000 });
                }
                setOpen(false);
            }
            else {
                setOpen(false);
            }

        }
        else {

            if (data) {
                // actions.setPictureName(data.name)
                // actions.setPictureDescription(data.description)
                const imageDetailsid = states.portfolioDetailsWithImages?.pictures[currentIndex]._id
                const url = states.portfolioDetailsWithImages?.pictures[currentIndex].url;
                if (!imageDetailsid || !url) {
                    return
                }
                const name = data.name ?? '';
                const description = data.description ?? '';
                const obj = { imageDetailsid, name, description, url }
                updateImage(obj)

            }
        }
    };

    return (
        <Grid container >
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: classes.paper }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Grid className={styles['containAll']}>
                        <Grid
                            // className={styles.title}

                            className={simplified ? `${styles['title2']}` : `${styles['title']}`}
                        >
                            {
                                simplified ? <>
                                    <label>Main Title</label>
                                    <TextField variant='standard' InputProps={{ disableUnderline: true, style: { color: "black", caretColor: states?.color } }}
                                        defaultValue={states.userInfo?.mainTitle}
                                        inputProps={{
                                            maxLength: 25
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                padding: 0,
                                            }
                                        }}
                                        {...register('mainTitle', { required: 'Title Required' })} />
                                    {errors['mainTitle'] && <span className={styles['error']}>{errors['mainTitle'].message?.toString()}</span>}
                                </>

                                    :
                                    <>
                                        <label>Title</label>
                                        <TextField variant='standard' InputProps={{ disableUnderline: true, style: { color: "black", caretColor: states?.color } }}
                                            defaultValue={states.portfolioDetailsWithImages?.pictures[currentIndex]?.name}
                                            inputProps={{
                                                maxLength: 25
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    padding: 0,
                                                }
                                            }}
                                            {...register('name')} />
                                    </>


                            }
                        </Grid >

                        {
                            !simplified && <Grid
                                className={styles['description']}
                            >
                                <label>DESCRIPTION</label>
                                <TextareaAutosize
                                    style={{ caretColor: states?.color }}
                                    placeholder="Description, year, style..."
                                    defaultValue={states.portfolioDetailsWithImages?.pictures[currentIndex]?.description}
                                    // ref={desRef}
                                    maxLength={300}
                                    {...register('description')}
                                />
                                {/* {errors.description && <span className={styles.error}>{errors.description.message}</span>} */}
                            </Grid>
                        }

                        <Grid style={{ display: 'flex', justifyContent: 'center', marginTop: simplified ? '35px' : '25px', marginBottom: simplified ? '35px' : '25px' }}>
                            <Grid className={styles['favIcon']}>
                                <Fab color="primary" type='submit' aria-label="add" classes={{ root: classes.avatarSize }}>
                                    <DoneIcon />
                                </Fab>
                            </Grid>
                        </Grid>

                    </Grid >
                </form >
            </Dialog >
        </Grid >
    )



}

export default EditPictureDetailsDialog;



