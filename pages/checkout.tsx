import React from 'react'
import { Grid } from "@material-ui/core";
import Pricing from '../components/Pricing/Pricing';

interface Props {

}



const checkout: React.FC<Props> = () => {
    return <Grid>
        <Pricing />
    </Grid>

}

export default checkout;