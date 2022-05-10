import {createContext} from "react";
import React from "react";

export interface AudioSelectContextI {
    currentAudioElement: React.RefObject<HTMLAudioElement | null>,
    isLibraryAudioOnPlay: boolean,
    setIsLibraryAudioOnPlay: (b: boolean) => void,
}

export const AudioSelectContext = createContext<AudioSelectContextI | null>(null);