import React, { MouseEventHandler } from 'react'
import { Grid } from "@mui/material";
import SvgIconRenderer from '../Helpers/SvgIconRenderer';
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';

interface Props {
    title: string,
    path: string,
    onClick?: MouseEventHandler<HTMLDivElement>
}

const LongButton: React.FC<Props> = (props) => {
    // Hooks
    // const actions = useActions()
    // const states = useAppState()

    // Funcs

    // Vars

    // JSX
    return (
        <div style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            // margin: "1.5rem 0.7rem 0 0.7rem"
            margin: "8px 12px 12px 12px"
        }}
            onClick={props.onClick}
        >
            <div style={{
                display: 'flex',
                justifyContent: "space-between"
            }}>
                <p style={{
                    color: 'black',
                    fontFamily: '"Bebas Neue"',
                    fontSize: "22px",
                    // padding: "1.5rem 0rem 0rem 1.5rem",
                    padding: 16,
                    margin: "0"
                }}>
                    {props.title}
                </p>

                <SvgIconRenderer
                    style={{
                        color: 'black',
                        margin: 16
                    }}
                    size={32}
                    path={props.path}
                />
            </div>
        </div>
    )

}

export default LongButton;