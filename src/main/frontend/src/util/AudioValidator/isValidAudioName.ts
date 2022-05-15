import {audioNameRegex} from "./regex";

export const isValidAudioName = (name: string) => {
    let regExpMatchArray = audioNameRegex.exec(name);
    return !(regExpMatchArray == null || regExpMatchArray[0] !== name);
}