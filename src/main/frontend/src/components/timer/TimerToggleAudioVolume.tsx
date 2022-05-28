import React, {useState} from 'react';
import {useStore} from "../../context/CacheStore/StoreContext";
import Volume from "../audio/components/Volume";
import classes from "./Timer.module.css";

const TimerToggleAudioVolume = () => {
    const store = useStore()!;

    const [audioVolume, setAudioVolume] = useState(100);

    const [serverState] = store.serverReducer;

    return (
        <div>

            {
                serverState.toggleAudio !== null && serverState.toggleAudio?.ref
                &&
                <div className={classes.timer__toggle}>
                    <p className={classes.timer__toggleText}>
                        Toggle audio volume
                    </p>
                    <div className={classes.timer__toggleVol}>
                        <Volume setAudioVolumeInPercents={setAudioVolume} audioElement={serverState.toggleAudio!.ref} audioVolume={audioVolume} setAudioVolume={setAudioVolume}/>
                    </div>

                </div>
            }
        </div>
    );
};

export default TimerToggleAudioVolume;