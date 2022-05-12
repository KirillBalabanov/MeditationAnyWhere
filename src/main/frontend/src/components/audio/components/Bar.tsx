import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";
import AudioFormatter from "../formatter/AudioFormatter";

interface BarProps {
    currentTime: number,
    duration: number,
    audioElement: React.RefObject<HTMLAudioElement>,
    setCurrentTime: (n: number) => void
}

const Bar: FC<BarProps> = React.memo(({currentTime, duration, audioElement, setCurrentTime}) => {
    return (
        <div className={classes.durationOuter}>
            <p className={classes.begin}>{AudioFormatter.format(Math.floor(currentTime))}</p>
            <input min={0} max={duration} value={currentTime} type="range" className={classes.duration} onChange={(e) => {
                audioElement.current!.currentTime = Number(e.target.value);
                setCurrentTime(Number.parseInt(e.target.value))
            }}/>
            <p className={classes.end}>{AudioFormatter.format(duration)}</p>
        </div>
    );
});

export default Bar;