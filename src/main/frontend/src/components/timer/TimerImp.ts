
class TimerImp {
    private _min: number;
    private _seconds: number;
    private readonly _len: number;
    private _currentLen: number;
    private _lenDecrement: number;
    private _canDecrement: boolean;
    public isDecrementing: boolean;

    constructor(min: number, seconds: number, radius: number) {
        this._min = min;
        this._seconds = seconds
        this._len = Math.floor(radius * 2 * 3.14);
        this._lenDecrement = this._len / ((this.min * 60) + this._seconds);
        this._currentLen = this._len;
        this._canDecrement = (min * 60 + seconds) > 0;
        this.isDecrementing = false;
    }

    buildString(): string {
        return this._min.toString().padStart(2, "0") + ":" + this._seconds.toString().padStart(2, "0");
    }

    decrement(): void {
        if (this._min == 0 && this._seconds == 0) {
            this._canDecrement = false;
            return;
        }

        if (this._seconds == 0) {
            this._min--;
            this._seconds = 59;
        }
        else this._seconds--;
        this._currentLen = this._currentLen - this._lenDecrement;
    }

    setTimer(min: number, sec: number): void {
        if(min < 0 || sec < 0) throw new Error("Illegal argument");
        this._min = min;
        this._seconds = sec;
        this._lenDecrement = this._len / ((this.min * 60) + this._seconds);
        this._currentLen = this._len;
        this._canDecrement = true;
    }

    get canDecrement(): boolean {
        return this._canDecrement;
    }

    get min(): number {
        return this._min;
    }

    get seconds(): number {
        return this._seconds;
    }

    get currentLen(): number {
        return this._currentLen;
    }

    set currentLen(value: number) {
        this._currentLen = value;
    }
}

export default TimerImp;