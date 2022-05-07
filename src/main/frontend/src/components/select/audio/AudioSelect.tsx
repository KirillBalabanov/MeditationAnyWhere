import React, {useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioPreviewLooped from "../../audio/preview/AudioPreviewLooped";
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import InlineAudio from "../../audio/inline/InlineAudio";
import Slider from "../../slider/Slider";

const AudioSelect = () => {
    const [isToggled, setIsToggled] = useState(false);
    return (
        <div className={isToggled ? classes.select + " " + classes.selectToggled : classes.select}>
            <div className={classes.title} onClick={() => setIsToggled(!isToggled)}>
                <div className={classes.titleInner}>
                    <img src={selectAudioIcon} alt=""/>
                    <p className={classes.titleText}>Select your audio</p>
                </div>
            </div>
            <Slider width={350} amountOfElements={2}>
                <div className={classes.library}>
                    <div className={classes.libraryTitle}>
                        Default library
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                </div>
                <div className={classes.library}>
                    <div className={classes.libraryTitle}>
                        Default library
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                    <div className={classes.libraryItem}>
                        <p className={classes.libraryText}>title</p>
                    </div>
                </div>
            </Slider>

        </div>
    );
};

export default AudioSelect;