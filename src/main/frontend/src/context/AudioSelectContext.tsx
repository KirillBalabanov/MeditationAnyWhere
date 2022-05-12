import React, {createContext, FC, useContext, useState} from "react";
import {ContextProviderInterface} from "./ContextProviderInterface";

export interface AudioSelectContextI {
    currentAudioElement: HTMLAudioElement | null
    setCurrentAudioElement: (el: HTMLAudioElement | null) => void
    isLibraryAudioOnPlay: boolean,
    setIsLibraryAudioOnPlay: (b: boolean) => void,
}

const AudioSelectContext = createContext<AudioSelectContextI | null>(null);

export const useAudioSelectContext = () => useContext(AudioSelectContext);

export const AudioSelectContextProvider: FC<ContextProviderInterface> = ({children}) => {

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
    )
};