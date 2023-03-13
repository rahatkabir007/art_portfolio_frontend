import React from 'react'
import { Grid } from "@material-ui/core";
import Login from '../components/Login/Login';


interface Props {

}


const LoginPage: React.FC<Props> = () => {


    return <Grid container>
        <Login />
    </Grid>

}

export default LoginPage;