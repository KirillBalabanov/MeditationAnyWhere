import TimerImp from "./TimerImp";

class TimerService {
    private timerImp: TimerImp;
    private interval: NodeJS.Timer | undefined;
    private readonly setPopupContent: (str: string) => void;
    private readonly setTimer: (str: string) => void;
    private readonly setTimerRunning: (b: boolean) => void;
    private readonly callbackAfterTimerFinish: () => void;
    private _running: boolean;


    constructor(timerImp: TimerImp, setPopupContent: (str: string) => void, setTimer: (str: string) => void, setTimerRunning: (b: boolean) => void,
                callbackAfterTimerFinish: () => void) {
        this.timerImp = timerImp;
        this.setPopupContent = setPopupContent;
        this.setTimer = setTimer;
        this.setTimerRunning = setTimerRunning;
        this._running = false;
        this.callbackAfterTimerFinish = callbackAfterTimerFinish;
    }

    public run(): void {
        if(this.timerImp.min === 0 && this.timerImp.seconds === 0) throw Error("Timer cannot run.");
        this._running = true;
        this.setTimerRunning(true);
        this.setPopupContent("Listened " + this.timerImp.min.toString() + "min")
        this.interval = setInterval(() => {

            this.timerImp.decrement();
            this.setTimer(this.timerImp.buildString());

            if(!this.timerImp.canDecrement) { // timer finish
                clearInterval(this.interval!);
                this.timerImp.currentLen = 0;
                this.callbackAfterTimerFinish();
            }
        }, 10);
    }

    public stop(): void {
        if(this.interval === undefined) return;
        clearInterval(this.interval);
        this._running = false;
        this.setTimerRunning(false);
    }

    public isRunning(): boolean {
        return this._running;
    }

    public getTimerLen(): number {
        return this.timerImp.currentLen;
    }

    public setTimerValues(min: number, sec: number) {
        this.timerImp.setTimer(min, sec);
    }

    public getTimerValues(): string {
        return this.timerImp.buildString();
    }
}

export default TimerService;