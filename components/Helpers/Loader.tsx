import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Dialog } from "@material-ui/core";
import { useAppState } from '../../src/Overmind/OvermindHelper';

interface Props {

}

const useStyles = makeStyles(() => {
    return {
        dialogRoot: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }
});

const Loader: React.FC<Props> = () => {
    // Hooks
    // const actions = useActions()
    const states = useAppState()
    const classes = useStyles();


    // Funcs

    // Vars

    // JSX

    return (
        <>
            <Dialog
                open={states.dialogLoading}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                classes={{ root: classes.dialogRoot }}
                title='Loading'
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            >
                <CircularProgress style={{
                    color: 'black', height: '60px', width: '60px', margin: '15px'
                }} />
                {/* <Grid>Wait a moment!</Grid> */}
            </Dialog>
        </>
    );
}

export default Loader;