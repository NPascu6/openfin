import {Button, Typography} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import {Link} from "react-router-dom";

const useStyles = makeStyles(() => {
        return createStyles({
            root: {
                flex: 1,
                overflow: "auto",
                textAlign: "center"
            },
        });
    }
);

const NotFoundPage: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={clsx(classes.root)}>
            <Typography variant="h5" gutterBottom>
                [Oops]
            </Typography>
            <Typography variant="h6" gutterBottom>
                API Connection Lost, please re-open window.
            </Typography>
            <p style={{textAlign: "center"}}>
                <Button variant="contained" color="primary" to="/" aria-label={'Home'} component={Link}>Reload</Button>
            </p>
        </div>
    );
};

export default NotFoundPage;
