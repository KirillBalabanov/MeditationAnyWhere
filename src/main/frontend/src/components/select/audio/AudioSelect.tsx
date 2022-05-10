import React, {FC, useCallback, useState} from 'react';
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import classes from "./AudioSelect.module.css";
import Slider from "../../slider/Slider";

const AudioSelect: FC = React.memo(() => {
    const [selectShown, setSelectShown] = useState(false);

    const selectShownToggle = useCallback(() => {
        setSelectShown(!selectShown);
    }, [selectShown]);

    return (
        <div className={selectShown ? classes.select + " " + classes.selectShown : classes.select}>
            <div className={classes.title}>
                <div className={classes.titleInner} onClick={selectShownToggle}>
                    <img src={selectAudioIcon} alt=""/>
                    <p className={classes.titleText}>Select your audio</p>
                </div>
            </div>
            <Slider elementWidth={350} amountOfElements={2}>
                <div className={classes.library}>
                    <div className={classes.libraryTitle}>
                        Your library
                    </div>
                </div>
                <div className={classes.library}>
                    <div className={classes.libraryTitle}>
                        Default library
                    </div>
                </div>
            </Slider>
        </div>
    );
});

export default AudioSelect;