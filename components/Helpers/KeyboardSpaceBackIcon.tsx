import React from 'react'
import { Grid } from "@mui/material";
import { useAppState } from '../../src/Overmind/OvermindHelper';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next/router';

interface Props {
    simplified?: boolean;
    windowPathName: string;
    // handleSubmit?: (e: React.FormEvent<HTMLFormElement|SVGSVGElement>) => Promise<void>;
    // userDetail?: boolean;
}




const KeyboardSpaceBackIcon: React.FC<Props> = (props) => {
    const states = useAppState()
    const router = useRouter();

    const { simplified, windowPathName
        // , handleSubmit, userDetail
    } = props;


    return (
        <>
            {simplified ?
                // <Grid style={{ backgroundImage: `url(${back.src})`, backgroundColor: '', height: '100vh', width: '100vw', position: 'fixed' }}>
                <Grid style={{ backgroundImage: `url('https://i.ibb.co/t8Yss5g/back.jpg')`, backgroundColor: '', height: '100vh', width: '100vw', position: 'fixed' }}>
                    <KeyboardBackspaceIcon onClick={() => {
                        // if (userDetail && handleSubmit) {
                        //     console.log('go')
                        //     await handleSubmit(e)
                        // }
                        // console.log('window')
                        // setTimeout(() => {
                        router.back()
                        // },500)                    
                        sessionStorage.setItem(windowPathName, JSON.stringify(0))

                    }}
                        style={{ color: 'white', fontSize: '50px', zIndex: 1, position: 'fixed' }} />
                </Grid >
                :
                <Grid style={{
                    backgroundColor: 'white', height: '50px', position: 'fixed', width: '100%', left: '0px', top: '0px', zIndex: 2
                }}>
                    <KeyboardBackspaceIcon onClick={() => {
                        // console.log('window',Router.pathname)
                        router.back()
                        sessionStorage.setItem(windowPathName, JSON.stringify(0))
                    }}
                        style={{ color: states?.color, fontSize: '50px', zIndex: 1 }} />
                </Grid >
            }
        </>
    )
}

export default KeyboardSpaceBackIcon;