import React, {useEffect, useRef, useState} from 'react';
import classes from "../components/timer/Timer.module.css";
import Popup from "../components/popup/Popup";
import Timer from "../components/timer/Timer";
import TimerStartButton from "../components/timer/TimerStartButton";
import AudioSelect from "../components/select/audio/AudioSelect";
import {useFetching} from "../hooks/useFetching";
import {AudioI} from "../types/types";
import AudioSource from "../components/audio/components/AudioSource";


const MainPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [audioToggleModel, setAudioToggleModel] = useState<AudioI | null>(null);
    const audioToggle = useRef<HTMLAudioElement>(null);
    useFetching<AudioI>("/server/audio/toggle", setIsLoading, setAudioToggleModel)

    const [popupContent, setPopupContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const [audioPlaying, setAudioPlaying] = useState<React.RefObject<HTMLAudioElement> | null>(null);

    console.log("main page");


    return (
        <div className={classes.main}>
            <Timer isPlayingState={isPlaying} setIsPlayingState={setIsPlaying} setPopupContent={setPopupContent} setShowPopup={setShowPopup}
            audioToggle={audioToggle}/>
            <AudioSelect setAudioPlaying={setAudioPlaying}></AudioSelect>
            <TimerStartButton toggleTimerCallback={() => setIsPlaying(!isPlaying)} isPlayingState={isPlaying}/>
            {
                audioToggleModel != null && "audioUrl" in audioToggleModel
                &&
                <AudioSource url={audioToggleModel?.audioUrl} audioElement={audioToggle}/>
            }
            <Popup popupInfo={popupContent} popupConfirm={"Ok"} shown={showPopup} setShown={setShowPopup}></Popup>
        </div>
    );
};

export default MainPage;
