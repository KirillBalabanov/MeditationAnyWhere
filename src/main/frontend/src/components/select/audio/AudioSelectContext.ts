import {createContext} from "react";
import React from "react";

export interface AudioSelectContextI {
    currentAudioElement: HTMLAudioElement | null
    setCurrentAudioElement: (el: HTMLAudioElement | null) => void
    isLibraryAudioOnPlay: boolean,
    setIsLibraryAudioOnPlay: (b: boolean) => void,
}

export const AudioSelectContext = createContext<AudioSelectContextI | null>(null);