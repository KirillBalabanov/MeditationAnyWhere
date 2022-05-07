import {useRef, useState} from "react";

export const useAudio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioShown, setAudioShown] = useState(false);
    const [audioVolume, setAudioVolume] = useState(100);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    let audioElement = useRef<HTMLAudioElement>(null);

    return {isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, audioShown, setAudioShown, audioVolume, setAudioVolume, audioElement};
};