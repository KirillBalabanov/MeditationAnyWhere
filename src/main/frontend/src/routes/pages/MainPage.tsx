import React, {FC} from 'react';
import classes from "../styles/MainPage.module.css";
import Timer from "../../components/timer/Timer";
import TimerSelect from "../../components/timer/TimerSelect";
import TimerSelectItem from "../../components/timer/TimerSelectItem";
import TimerButton from "../../components/timer/TimerButton";
import AudioSelect from "../../components/select/audio/AudioSelect";
import {TimerContextProvider} from "../../context/TimerContext";
import {AudioSelectContextProvider} from "../../context/AudioSelectContext";
import TimerToggleAudioVolume from "../../components/timer/TimerToggleAudioVolume";

const MainPage: FC = () => {

    return (
        <div className={classes.main}>
            <div className="container">
                <TimerContextProvider>
                    <AudioSelectContextProvider>
                        <Timer/>
                        <TimerSelect>
                            <TimerSelectItem timerValue={1}></TimerSelectItem>
                            <TimerSelectItem timerValue={5}></TimerSelectItem>
                            <TimerSelectItem timerValue={7}></TimerSelectItem>
                            <TimerSelectItem timerValue={10}></TimerSelectItem>
                            <TimerSelectItem timerValue={12}></TimerSelectItem>
                            <TimerSelectItem timerValue={15}></TimerSelectItem>
                            <TimerSelectItem timerValue={20}></TimerSelectItem>
                            <TimerSelectItem timerValue={25}></TimerSelectItem>
                            <TimerSelectItem timerValue={30}></TimerSelectItem>
                            <TimerSelectItem timerValue={40}></TimerSelectItem>
                            <TimerSelectItem timerValue={50}></TimerSelectItem>
                            <TimerSelectItem timerValue={60}></TimerSelectItem>
                        </TimerSelect>
                        <TimerToggleAudioVolume/>
                        <AudioSelect></AudioSelect>

                    </AudioSelectContextProvider>
                    <TimerButton></TimerButton>
                </TimerContextProvider>
            </div>
        </div>
    );
};

export default MainPage;
