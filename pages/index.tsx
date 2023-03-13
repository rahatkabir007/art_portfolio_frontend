import React from 'react';
import { Grid } from "@material-ui/core";
// import { makeStyles } from '@material-ui/core/styles';
import Welcome from '../components/Welcome/Welcome';



// const getThemeObj = (theme: Theme) => {
//     return {
//         button: { marginTop: 8 },
//     }
// }

// const useStyles = makeStyles((theme: Theme) => (getThemeObj(theme)))

const index: React.FC = ({ }) => {

    return <Grid >
        <Welcome />
    </Grid>
}

export default index;
