
class TimerImp {
    private _min: number;
    private _seconds: number;

    constructor(min: number, seconds: number) {
        this._min = min;
        this._seconds = seconds
    }

    buildString(): string {
        return this._min.toString().padStart(2, "0") + ":" + this._seconds.toString().padStart(2, "0");
    }

    decrement(): void {
        if(!this.canRun()) return;

        if (this._seconds == 0) {
            this._min--;
            this._seconds = 60;
        }
        else this._seconds--;
    }

    setTimer(min: number, sec: number): void {
        if(min < 0 || sec < 0) throw new Error("Illegal argument");
        this._min = min;
        this._seconds = sec;
    }

    canRun(): boolean {
        return this._min > 0 || this._seconds > 0;
    }


    get min(): number {
        return this._min;
    }

    get seconds(): number {
        return this._seconds;
    }
}

export default TimerImp;