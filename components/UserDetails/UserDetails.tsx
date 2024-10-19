import { Fab, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import styles from "./UserDetails.module.css";
import AddIcon from '@mui/icons-material/Add';
import { useAppState } from '../../src/Overmind/OvermindHelper';
import { useDropzone } from 'react-dropzone';
import { IUser } from '../../interfaces/dataInterface';


interface Props {
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setImgPath: React.Dispatch<File | null>
    data: Partial<IUser>
    userDetailsId: string | string[] | undefined
    loggedinSlug: string | undefined
}

const UserDetails: React.FC<Props> = ({ handleOnChange, setImgPath, data, loggedinSlug, userDetailsId }) => {

    const states = useAppState()
    // const actions = useActions();

    const [files, setFiles] = useState<Array<File & {
        preview: string;
    }>>([]);
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/jpeg': ['.jpeg'],
            'image/png': ['.png'],

        },
        onDrop: (acceptedFiles: Array<File>) => {
            setImgPath(acceptedFiles[0]);
            const acceptedFile = acceptedFiles.map(file => {
                return Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            })
            setFiles(acceptedFile)
            // setFiles(acceptedFiles.map(file => {
            //     return Object.assign(file, {
            //         preview: URL.createObjectURL(file)
            //     })
            // }));
        }
    });


    // const thumbs = files.map(file => (
    //     //@ts-ignore
    //     <div key={file.name}>
    //         <div>
    //             {
    //                 //@ts-ignore
    //                 file?.preview ? <img
    //                 //@ts-ignore
    //                 src={file?.preview}
    //             /> :
    //                     <img
    //                 //@ts-ignore
    //                 src={data.user?.profilePic}
    //             />

    //             }

    //         </div>
    //     </div>
    // ));

    const thumbs = () => {
        if (!states?.userInfo?.avatar) {
            return
        }
        if (files.length === 0) {
            return (
                <picture>
                    <img src={states?.userInfo?.avatar}
                        style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            margin: '0 auto',
                            textAlign: 'center',
                            backgroundColor: '#e3e3e3',
                            objectFit: 'cover'
                        }}
                        alt="Profile Picture" />
                </picture>
            )
        }
        return (
            <picture>
                <img src={files[0].preview}
                    style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        margin: '0 auto',
                        textAlign: 'center',
                        backgroundColor: '#e3e3e3',
                        objectFit: 'cover'
                    }}
                    alt="Profile Picture" />
            </picture>

        )

    }
    // useEffect(() => {
    //     document.querySelector(body).style.background = "#000";
    // }, [])
    return (
        <div className={styles['container']}>
            <div className={styles['imageContainer']}>
                {/* <Grid>
                    <img src={data.user.profilePic} alt="" />
                </Grid> */}
                <div>
                    {thumbs()}
                    {/* {thumbs} */}
                </div>
                <Fab {...getRootProps({ className: 'dropzone' })} className={styles['icon']} style={userDetailsId !== loggedinSlug ? { visibility: 'hidden' } : { visibility: 'visible', background: states.userInfo?.color, color: 'white' }} aria-label="add" size="small">
                    <AddIcon style={{ fontSize: '28px' }} />
                    <input type="file" {...getInputProps()}
                        name="profilePic"
                    />
                </Fab>
            </div>

            <div className={styles['name']}>
                <TextField
                    variant='standard'
                    name="fullName"
                    type="text"
                    placeholder='YOUR ARTIST NAME'
                    value={data?.fullName}
                    onChange={handleOnChange}
                    InputProps={{
                        disableUnderline: true,
                        style: {
                            color: states.userInfo?.color,
                            textTransform: 'uppercase',
                            fontFamily: "Bebas Neue",
                            fontSize: '35px',
                            letterSpacing: '0.7px',
                            textAlign: 'center',
                            display: 'inline',
                        }
                    }}
                    inputProps={{
                        maxLength: 30
                    }}
                    sx={{
                        '& .MuiInputBase-input': {
                            padding: 0,
                        }
                    }}
                />
                <TextField
                    variant='standard'
                    name="occupation"
                    type="text"
                    placeholder='Your Occupation'
                    value={data?.occupation}

                    onChange={handleOnChange}
                    InputProps={{
                        disableUnderline: true,
                        style: {
                            color: 'black',
                            textTransform: 'capitalize',
                            fontFamily: "Poppins",
                            fontSize: '20px',
                            textAlign: 'center'
                        }
                    }}
                    inputProps={{
                        maxLength: 30
                    }}
                />
            </div>
            <div className={styles['portfolioCount']}>
                <div className={styles['portfolios']}>
                    <p className={styles['portfolioLength']}>{states.totalPortfolioNumber}</p>
                    <p className={styles['portfolio']}>Portfolios</p>
                </div>
                <div className={styles['pictures']}>
                    <p className={styles['portfolioImagesLength']}>{states.pictureNumber}</p>
                    <p className={styles['portfolioPictures']}>Pictures</p>
                </div>
            </div>


        </div>
    )
}

export default UserDetails