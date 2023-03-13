import React from 'react'
// import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
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
        <Grid className={styles['textSize']} style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', fontSize: '25px', alignItems: 'center', marginTop: '80px' }}>
            <Grid style={{ width: '65vw', fontFamily: 'Poppins', fontSize: '14px' }}>Are you sure that you want to delete this Portfolio?</Grid>
            <Grid style={{ display: 'flex', flexDirection: 'row', marginTop: '30px', color: `${states?.color}`, fontFamily: 'Bebas Neue' }}>
                <Grid style={{ margin: '0 10px', cursor: 'pointer' }} onClick={() => { handleCancel() }} >Cancel</Grid>
                <Grid style={{ margin: '0 10px', cursor: 'pointer' }} onClick={() => { handleDelete() }}>Ok</Grid>
            </Grid>
        </Grid>
    )

}

export default DeleteMenu;
