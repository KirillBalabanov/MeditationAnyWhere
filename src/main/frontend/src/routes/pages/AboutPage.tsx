import React from 'react';

import classes from "../styles/AboutPage.module.css";

const AboutPage = () => {
    return (
        <div>
            <div className="container">
                <div className={classes.content}>
                    <div className={classes.block}>
                        <h4 className={classes.blockTitle}>
                            About project:
                        </h4>
                        <p className={classes.blockText}>
                            MeditationAnyWhere is made for people who want to <b>improve</b> themself.
                        </p>
                        <p className={classes.blockText}>
                            MeditationAnyWhere  is a comfort place when you can meditate listening to whatever sounds you like
                            and track your statistics. It's very important to constantly remind yourself of your progress.
                        </p>
                        <p className={classes.blockText}>
                            The main idea of the project is to make people more mindful. Wherever you are, you just
                            can visit this website and set up a meditation session.
                        </p>
                    </div>
                    <div className={classes.block}>
                        <h4 className={classes.blockTitle}>
                            Developer contacts:
                        </h4>
                        <div className={classes.line}>
                            <a href="https://github.com/KirillBalabanov" className={classes.blockLink}>github</a>
                        </div>
                        <div className={classes.line}>
                            <a href="https://www.linkedin.com/in/kirill-balabanov-982355241/" className={classes.blockLink}>linkedin</a>
                        </div>
                        <div className={classes.line}>
                            <a href="mailto:kirillbalabanov77711777@gmail.com" className={classes.blockLink}>gmail</a>
                        </div>
                        <div className={classes.line + " " + classes.coffee}>
                            <a href='https://ko-fi.com/T6T7D48XQ' target='_blank'>
                                <img height='36' style={{border: 0, height: "36px"}} src='https://cdn.ko-fi.com/cdn/kofi2.png?v=3' alt='Buy Me a Coffee at ko-fi.com' />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;