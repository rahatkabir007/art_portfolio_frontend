import React, { Dispatch } from 'react'
import { Grid } from "@mui/material";
import { useActions, useAppState } from '../../../src/Overmind/OvermindHelper';
import { useDropzone } from 'react-dropzone';
import styles from './DropzoneCreate.module.css';
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import CloseIcon from '@mui/icons-material/Close';
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from 'array-move';
import { useSnackbar } from 'notistack';

interface Props {
    files: Array<File>,
    setFiles: Dispatch<Array<File>>,
    filesUrl: Array<string>,
    setFilesUrl: Dispatch<Array<string>>,
}



const DropzoneCreate: React.FC<Props> = ({ files, filesUrl, setFiles, setFilesUrl }) => {
    const actions = useActions()
    const states = useAppState()

    const { enqueueSnackbar } = useSnackbar();


    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': ['.jpeg', '.jpg', '.png']
        },
        maxSize: 32 * 1048576, //32mb
        // maxSize: 100000, 
        onDrop: (acceptedFiles, fileRejections) => {
            { files.length == 0 ? actions.setRejectedFiles(fileRejections.length) : actions.setRejectedFiles(states.rejectedFiles + fileRejections.length) }
            actions.addToSelectedFiles(acceptedFiles)
            const newBlobArr: Array<string> = []

            for (let i = 0; i < acceptedFiles.length; i++) {
                newBlobArr.push(URL.createObjectURL(acceptedFiles[i]))
            }
            const allFiles = [...files, ...acceptedFiles]
            const allFilesUrl = [...filesUrl, ...newBlobArr]
            setFiles(allFiles)
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
        const narr = arrayMoveImmutable(filesUrl, oldIndex, newIndex)
        const nFiles = arrayMoveImmutable(files, oldIndex, newIndex)

        setFilesUrl(narr);
        setFiles(nFiles);

        // setEditPortfolioDetails();
    };

    const thumbs = filesUrl.length > 0 && filesUrl.map((file, index) => {
        return (
            <SortableItem
                key={index}>
                <div className={styles['images']} key={index}>
                    <picture>
                        <img
                            src={file}
                            className={styles['image']}
                            alt=""
                        />
                    </picture>
                    <div onClick={() => {
                        const afterDeleteExistingFiles = files.filter((___, ind) => { return ind !== index })
                        const afterDeleteExistingUrl = filesUrl.filter((___, ind) => { return ind !== index })
                        setFiles(afterDeleteExistingFiles)
                        setFilesUrl(afterDeleteExistingUrl)
                    }} >
                        <CloseIcon className={styles['closeIcon']} />
                    </div>
                </div>
            </SortableItem>
        )
    });

    return <>
        <SortableList onSortEnd={onSortEnd} >
            <div className={styles['imageContainer']}>
                {thumbs}
                <Grid {...getRootProps({ className: 'dropzone' })} >
                    <input {...getInputProps()}
                        type="file"
                    />
                    <div className={styles['root']}>
                        <FilterHdrIcon />
                        <p>Add Pictures</p>
                    </div>
                </Grid>

            </div>
        </SortableList>
    </>


}
export default DropzoneCreate;