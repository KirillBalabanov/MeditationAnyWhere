import React, {FC} from 'react';
import classes from "./Loader.module.css";

const Loader: FC = React.memo(() => {
    return (
        <div className={classes.loaderOuter}>
            <div className={classes.loader}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
});

export default Loader;