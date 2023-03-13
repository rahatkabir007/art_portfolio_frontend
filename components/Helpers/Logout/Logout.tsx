import React, { useEffect } from 'react'
import { Grid } from "@material-ui/core";
import { useActions } from '../../../src/Overmind/OvermindHelper';
import styles from './Logout.module.css';
import { SocialLogin } from '../SocialLogin';
import { CookiesHandler } from '../CookiesHandler';
interface Props {

}



const Logout: React.FC<Props> = () => {
    const actions = useActions()

    useEffect(() => {
        SocialLogin.initFirebase()
    }, [])


    const handleLogout = async () => {
        await SocialLogin.logOut();
        CookiesHandler.removeAccessToken();
        actions.positionSet(0)
        localStorage.clear();
        sessionStorage.clear();
        // router.push('/login')
        window.location.href = "/login"
    }

    return <Grid className={styles['container']}>
        <button className={styles['logoutBtn']}
            onClick={handleLogout}
        >
            Logout
        </button>
    </Grid>

}

export default Logout;