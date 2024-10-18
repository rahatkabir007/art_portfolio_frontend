import React, { Dispatch, useEffect } from 'react'
// import { makeStyles } from '@mui/styles';
import { Grid } from "@mui/material";
import { useActions, useAppState } from '../../../src/Overmind/OvermindHelper';
import { useDropzone } from 'react-dropzone';
import styles from './Dropzone.module.css';
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from 'array-move';
import { IPicture, IPortfolio } from '../../../interfaces/dataInterface';

interface Props {
    files: Array<File>,
    setFiles: Dispatch<Array<File>>,
    filesUrl: Array<string>,
    setFilesUrl: Dispatch<Array<string>>,
    editportfolioDetails: IPortfolio | null,
    setEditPortfolioDetails: Dispatch<IPortfolio | null>,
    portfolioDeletedImgDetails: Array<IPicture>,
    setPortfolioDeletedImgDetails: Dispatch<Array<IPicture>>,
    // setAtleastImage: any
}

// const getThemeObj = (theme: Theme) => {
//     return {
//         //    
//     }
// }

// const useStyles = makeStyles((theme: Theme) => (getThemeObj(theme)))




const Dropzone: React.FC<Props> = ({ files, filesUrl, setFiles, setFilesUrl, editportfolioDetails, setEditPortfolioDetails, portfolioDeletedImgDetails, setPortfolioDeletedImgDetails }) => {
    const actions = useActions();
    const states = useAppState();
    // const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();


    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': ['.jpeg', '.png']
        },
        maxSize: 32 * 1048576, //32mb
        // maxSize: 70000, //32mb
        onDrop: (acceptedFiles, fileRejections) => {

            {
                files.length == 0 ? actions.setRejectedFiles(fileRejections.length) : actions.setRejectedFiles(states.rejectedFiles + fileRejections.length)
            }

            actions.addToSelectedFiles(acceptedFiles)

            const newBlobArr: Array<string> = []

            for (let i = 0; i < acceptedFiles.length; i++) {
                newBlobArr.push(URL.createObjectURL(acceptedFiles[i]))
            }

            const allFiles = [...files, ...acceptedFiles]
            // const allFilesUrl = [...filesUrl, ...newBlobArr]
            const allFilesUrl = [...newBlobArr]
            setFiles(allFiles)
            // setEditPortfolioDetails({
            //     ...editportfolioDetails,
            //     pictures: editportfolioDetails?.pictures.concat(allFilesUrl.map(fileUrl => ({ url: fileUrl })))
            // });
            // setFilesUrl(allFilesUrl)

            if (!editportfolioDetails || !editportfolioDetails?._id) {
                return
            }

            setEditPortfolioDetails({
                ...editportfolioDetails,
                pictures: editportfolioDetails?.pictures.concat(allFilesUrl.map(fileUrl => {
                    return {
                        url: fileUrl,
                        added: true,
                    }
                }))
            });

            // const coverImagesNumber = Number(localStorage.getItem('coverImageLength') || '0')
            // const newCoverImagesNumber = coverImagesNumber + allFilesUrl.length
            // localStorage.setItem('coverImageLength', newCoverImagesNumber)
            actions.setCoverImagesArray(new Array(states.coverImagesArray.length + allFilesUrl.length).fill(1).map((___, index) => { return index + 1 }))


            setFilesUrl(allFilesUrl)


            {
                states.rejectedFiles > 0 && fileRejections.length > 0
                    ?
                    enqueueSnackbar(`${states.rejectedFiles} ${states.rejectedFiles == 1 ? 'picture' : 'pictures'} rejected for overlimit (32MB)`, { variant: 'warning', autoHideDuration: 2000 })
                    : ''
            }

        }
    });

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        if (!editportfolioDetails?.pictures) {
            return
        }
        const narr = arrayMoveImmutable(editportfolioDetails?.pictures, oldIndex, newIndex)


        setEditPortfolioDetails({
            ...editportfolioDetails,
            pictures: narr
        });
    };

    useEffect(() => {
        // cover image test
        // const coverImagesNumber = Number(localStorage.getItem('coverImageLength') || '0')
        const coverImagesLength = editportfolioDetails?.pictures?.length
        actions.setCoverImagesArray(new Array(coverImagesLength).fill(1).map((___, index) => { return index + 1 }))

    }, [editportfolioDetails?.pictures?.length, filesUrl])



    // const thumbs = filesUrl.length > 0 && filesUrl.map((file, index) => (
    //     <SortableItem key={index}>
    //         <Grid className={styles.images} >
    //             <img
    //                 src={file}
    //                 className={styles.image}
    //             />
    //             <div onClick={() => {
    //                 const afterDeleteExistingFiles = files.filter((file, ind) => ind !== index)
    //                 const afterDeleteExistingFilesUrl = filesUrl.filter((file, ind) => ind !== index)
    //                 setFiles(afterDeleteExistingFiles)
    //                 setFilesUrl(afterDeleteExistingFilesUrl)

    //             }} >
    //                 <CloseIcon
    //                     style={{
    //                         color: 'white',
    //                         background: 'rgba(0, 0, 0, 0.400)',
    //                         borderRadius: '50%',
    //                         padding: '5px',
    //                         fontSize: '22px',
    //                         position: 'absolute',
    //                         bottom: '7rem',
    //                         right: '1rem'

    //                     }}
    //                 />
    //             </div>
    //         </Grid>
    //     </SortableItem>


    // ));

    // useEffect(() => {
    //     // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    //     return () => states.selectedFiles.forEach(file => URL.revokeObjectURL(file));
    // }, [states.selectedFiles]);


    return <>
        <SortableList onSortEnd={onSortEnd} className={styles["totalImageContainer"]}>
            <Grid className={styles["imageContainer"]}>

                {editportfolioDetails?.pictures?.map((item, index) => {
                    return (
                        !item.deleted && <SortableItem key={index}>
                            <Grid className={styles["images"]}>
                                <picture>
                                    <img style={{ backgroundColor: '#e3e3e3' }} src={item.url}
                                        className={styles["image"]} alt=""
                                    />
                                </picture>
                                <div onClick={() => {
                                    // setEditPortfolioDetails({ ...editportfolioDetails, pictures: editportfolioDetails.pictures.filter((file, ind) => ind !== index) })
                                    // const deletedfiles = editportfolioDetails.pictures.filter((file, ind) => ind == index)
                                    // setPortfolioDeletedImgDetails([...portfolioDeletedImgDetails, deletedfiles[0].url])
                                    let arr = editportfolioDetails.pictures
                                    // arr[index] = {
                                    //     ...arr[index],
                                    //     deleted: true,
                                    // }
                                    // setEditPortfolioDetails({
                                    //     ...editportfolioDetails,
                                    //     pictures: arr
                                    // })

                                    const deletedPicture = arr[index]
                                    arr = arr.filter((___, index2) => {
                                        return index !== index2
                                    })

                                    setEditPortfolioDetails({
                                        ...editportfolioDetails,
                                        pictures: arr
                                    })

                                    // setPortfolioDeletedImgDetails([
                                    //     ...portfolioDeletedImgDetails,
                                    //     deletedPicture
                                    // ])

                                    const deletedImagesArrState = portfolioDeletedImgDetails
                                    deletedImagesArrState.push(deletedPicture)
                                    setPortfolioDeletedImgDetails(deletedImagesArrState)

                                    actions.setCoverImagesArray(new Array(states.coverImagesArray.length - 1).fill(1).map((___, index) => { return index + 1 }))

                                }} >
                                    <CloseIcon
                                        className={styles["icon"]}
                                    />
                                </div>
                            </Grid>
                        </SortableItem>


                    )
                })}
                <Grid {...getRootProps({ className: 'dropzone' })} >
                    <input {...getInputProps()}
                        type="file"
                    />
                    <Grid className={styles["root"]}>
                        <FilterHdrIcon />
                        <p>Add Pictures</p>
                    </Grid>
                </Grid>

            </Grid>
        </SortableList>
    </>


}

export default Dropzone;
