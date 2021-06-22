import {LinearProgress, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flex: 1,
            alignItems: "center",
            width: "100%"
        },
        content: {
            width: "50%",
            textAlign: "center",
            margin: "0 auto"
        }
    })
);
const PageLoader = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Typography variant="h6" gutterBottom>
                    Loading ...
                </Typography>
                <LinearProgress color="secondary"/>
            </div>
        </div>
    )
}

export default PageLoader;