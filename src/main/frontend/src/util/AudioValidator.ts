class AudioValidator {
    private static audioNameRegex = /[A-Za-z1-9][A-Za-z1-9 ._]{1,18}[a-zA-Z1-9]/;

    public static isValidAudioName(name: string): boolean {
        let regExpMatchArray = name.match(this.audioNameRegex);
        if(regExpMatchArray == null || regExpMatchArray[0] !== name) return false;
        return true;
    }
}

export default AudioValidator;