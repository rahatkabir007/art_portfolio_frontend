import React from 'react'
import { Grid } from "@mui/material";
import Pricing from '../components/Pricing/Pricing';

interface Props {

}



const checkout: React.FC<Props> = () => {
    return <Grid>
        <Pricing />
    </Grid>

}

export default checkout;