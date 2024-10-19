import React from 'react'
// import { makeStyles } from '@mui/styles';
import { Grid } from "@mui/material";
import {
    // useActions,
    useAppState
} from '../../src/Overmind/OvermindHelper';
import styles from './DeleteMenu.module.css';

interface Props {
    afterDeletePosition?: () => void;
    // setDeleteDrawerOpen: boolean;
    setDeleteDrawerOpen?: (deleteDrawerOpen: boolean) => void;
    deleteDrawerOpen?: boolean;
}

// const useStyles = makeStyles((theme) => ({
//     // Define your styles here
// }));

const DeleteMenu: React.FC<Props> = ({ afterDeletePosition, setDeleteDrawerOpen, deleteDrawerOpen }) => {
    // Hooks
    // const actions = useActions()
    const states = useAppState()
    // const classes = useStyles();

    // Funcs

    // Vars

    // JSX

    const handleCancel = () => {
        if (!setDeleteDrawerOpen) {
            return
        }
        setDeleteDrawerOpen(!deleteDrawerOpen)

    };
    const handleDelete = () => {
        if (!afterDeletePosition) {
            return
        }
        afterDeletePosition()

    };

    return (
        <div className={styles['textSize']} style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', fontSize: '25px', alignItems: 'center', marginTop: '80px' }}>
            <div style={{ width: '65vw', fontFamily: 'Poppins', fontSize: '14px' }}>Are you sure that you want to delete this Portfolio?</div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '30px', color: `${states?.color}`, fontFamily: 'Bebas Neue' }}>
                <div style={{ margin: '0 10px', cursor: 'pointer' }} onClick={() => { handleCancel() }} >Cancel</div>
                <div style={{ margin: '0 10px', cursor: 'pointer' }} onClick={() => { handleDelete() }}>Ok</div>
            </div>
        </div>
    )

}

export default DeleteMenu;
