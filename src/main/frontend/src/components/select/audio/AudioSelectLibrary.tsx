import React, {FC} from 'react';
import classes from "./AudioSelect.module.css";

interface AudioSelectItemProps {
    children: React.ReactNode,
    title: string
}

const AudioSelectLibrary: FC<AudioSelectItemProps> = ({children, title}) => {

    return (
        <div className={classes.library}>
            <div className={classes.libraryTitle}>
                {title}
            </div>
            {children}
        </div>
    );
};

export default AudioSelectLibrary;