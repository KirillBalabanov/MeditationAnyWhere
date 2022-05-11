import React, {FC, useState} from 'react';
import {AudioSelectContext, AudioSelectContextI} from "../context/AudioSelectContext";
import {WrapperInterface} from "./WrapperInterface";

const AudioSelectWrapper: FC<WrapperInterface> = ({children}) => {
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

export default AudioSelectWrapper;