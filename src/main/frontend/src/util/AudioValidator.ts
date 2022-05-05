class AudioValidator {
    private static audioNameRegex = /[A-Za-z][A-Za-z1-9 ._]{1,18}[a-zA-Z]/;

    public static isValidAudioName(name: string): boolean {
        let regExpMatchArray = name.match(this.audioNameRegex);
        if(regExpMatchArray == null || regExpMatchArray[0] !== name) return false;
        return true;
    }
}

export default AudioValidator;