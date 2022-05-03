import React, {ReactElement} from 'react';
import classes from "./Section.module.css";

interface SectionProps {
    title: string,
    children: React.ReactNode
}

const Section = ({title, children}: SectionProps) => {
    return (
        <div className={classes.profile__section}>
            <div>
                <p className={classes.profile__sectionTitle}>{title}</p>
            </div>

            {children}
        </div>
    );
};

export default Section;