import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => {
    return {
        offset: {
            ...theme.mixins.toolbar,
            flexGrow: 1
        }
    }
});

React.useLayoutEffect = React.useEffect;

export default function AppBarOffset() {
    const classes = useStyles();
    return <div className={classes.offset} />;
}
