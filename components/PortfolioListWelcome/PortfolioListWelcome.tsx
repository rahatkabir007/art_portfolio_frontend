import React from 'react'
import { Grid } from "@material-ui/core";
import { useAppState } from '../../src/Overmind/OvermindHelper';
import styles from "./PortfolioListWelcome.module.css"

interface Props {

}


const PortfolioListWelcome: React.FC<Props> = () => {
    // const actions = useActions()
    const states = useAppState()

    return <Grid className={styles['welcomeMessage']}>
        <p style={{ color: states?.userInfo?.color }}>Hello,</p>
        <p style={{ color: states?.userInfo?.color }}>Create your first Portfolio</p>
        {/* <Grid className={styles.image}>
            <img style={{ backgroundColor: '#e3e3e3', borderRadius: '20px' }} src='https://i.ibb.co/jb2DXcc/unnamed1.png' alt="" />
        </Grid> */}
    </Grid>

}

export default PortfolioListWelcome;