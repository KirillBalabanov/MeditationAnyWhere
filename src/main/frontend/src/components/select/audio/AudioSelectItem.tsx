import React, {FC} from 'react';
import classes from "./AudioSelect.module.css";

interface AudioSelectItemProps {
    children: React.ReactNode,
    title: string
}

const AudioSelectItem: FC<AudioSelectItemProps> = React.memo(({children, title}) => {

    return (
        <div className={classes.library}>
            <div className={classes.libraryTitle}>
                {title}
            </div>
            {children}
        </div>
    );
});

export default AudioSelectItem;