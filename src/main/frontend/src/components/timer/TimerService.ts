
class TimerService {
    static formatToMinSecStr(s: number) {
        let sec = s % 60;
        let min = (s - sec) / 60;
        return min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
    }
}

export default TimerService;