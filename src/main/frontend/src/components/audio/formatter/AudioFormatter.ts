class AudioFormatter {
    static format(s: number) {
        let min = s / 60;
        let sec = s % 60;
        return Math.round(min).toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
    }
}

export default AudioFormatter;