import React, { MouseEventHandler } from 'react'
import { DialogTitle, IconButton, Typography } from "@mui/material";
import { SvgPaths } from '../../src/Others/SvgPaths';
import SvgIconRenderer from './SvgIconRenderer';
import { AppColors } from '../../src/Others/AppColors';

interface Props {
    children: React.ReactNode,
    onCrossClick?: MouseEventHandler
}

const MpDialogTitle: React.FC<Props> = (props) => {
    // Hooks

    // Funcs

    // Vars
    const dialogTitleStyle: React.CSSProperties = {
        backgroundColor: AppColors.PRIMARY_MAIN,
        color: AppColors.WHITE,
    }

    // JSX
    return (
        <DialogTitle style={dialogTitleStyle} >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Typography variant='h6'>{props.children}</Typography>
                <IconButton style={{ padding: 4 }} onClick={props.onCrossClick}>
                    <SvgIconRenderer path={SvgPaths.close} />
                </IconButton>
            </div>
        </DialogTitle>
    )

}

export default MpDialogTitle;