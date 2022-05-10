import React, {FC, useRef, useState} from 'react';
import {AudioSelectContextI, AudioSelectContext} from "./AudioSelectContext";

interface AudioSelectContextWrapProps {
    children: React.ReactNode
}

const AudioSelectContextWrap: FC<AudioSelectContextWrapProps> = ({children}) => {
    let [currentAudioElement, setCurrentAudioElement] = useState<HTMLAudioElement | null>(null);
    const [isLibraryAudioOnPlay, setIsLibraryAudioOnPlay] = useState(false);
    let AudioSelectContextImp: AudioSelectContextI = {
        currentAudioElement: currentAudioElement,
        setCurrentAudioElement: setCurrentAudioElement,
        isLibraryAudioOnPlay: isLibraryAudioOnPlay,
        setIsLibraryAudioOnPlay: setIsLibraryAudioOnPlay ,
    }

    return (
       <AudioSelectContext.Provider value={AudioSelectContextImp}>
           {children}
       </AudioSelectContext.Provider>
    );
};

export default AudioSelectContextWrap;