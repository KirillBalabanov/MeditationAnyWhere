import classes from "./SettingsLibrary.module.css";
import Section from "../section/Section";
import audioUploadIcon from "../../../images/audioUploadIcon.svg";
import InlineAudio from "../../audio/InlineAudio";
import React, {ChangeEvent, MouseEventHandler, useState} from "react";

const SettingsLibrary = () => {


    return (
        <div>
            <Section title={"Your audio"}>
                <form>
                    <label className={classes.input}>
                        <img src={audioUploadIcon} alt="upload audio" className={classes.inputImages}/>
                        <p className={classes.inputText}>Add new audio file</p>
                        <input type="file" style={{display: "none"}}/>
                        <p className={classes.inputError}>error</p>
                    </label>

                    <button className={classes.formButton}>Update library</button>
                </form>
            </Section>
            <Section title={"Standard music pack"}>
                <div className={classes.audioOuter}>
                    <InlineAudio title={"Sunny day"} url={'/server/music/default/Sunny day.mp3'}></InlineAudio>
                </div>
                <div className={classes.audioOuter}>
                    <InlineAudio title={"Rainy day"} url={'/server/music/default/Rainy day.mp3'}></InlineAudio>
                </div>
                <div className={classes.audioOuter}>
                    <InlineAudio title={"Heaven"} url={'/server/music/default/Heaven.mp3'}></InlineAudio>
                </div>

            </Section>
        </div>
    );
};

export default SettingsLibrary;