import React, { MouseEventHandler } from 'react'
import { Button, DialogActions } from "@mui/material";

interface IActionButton {
    text: string,
    onClick: MouseEventHandler
}

interface Props {
    positiveButton?: IActionButton,
    negativeButton?: IActionButton,
}

const MpDialogActions: React.FC<Props> = (props) => {
    // Hooks

    // Funcs

    // Vars

    // JSX
    return (
        <DialogActions>
            {
                props.negativeButton && <Button color="primary" onClick={props.negativeButton.onClick} >
                    {props.negativeButton.text}
                </Button>
            }

            {
                props.positiveButton && <Button color="primary" variant='outlined' onClick={props.positiveButton.onClick} >
                    {props.positiveButton.text}
                </Button>
            }
        </DialogActions>
    )

}

export default MpDialogActions;