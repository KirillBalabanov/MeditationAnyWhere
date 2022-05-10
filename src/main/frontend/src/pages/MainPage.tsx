import React from 'react';
import classes from "../styles/MainPage.module.css";
import Timer from "../components/timer/Timer";
import TimerContextWrap from "../components/timer/TimerContextWrap";
import TimerSelect from "../components/timer/TimerSelect";
import TimerSelectItem from "../components/timer/TimerSelectItem";
import TimerButton from "../components/timer/TimerButton";
import AudioSelect from "../components/select/audio/AudioSelect";
import AudioSelectContextWrap from "../components/select/audio/AudioSelectContextWrap";

const MainPage = () => {
    
    return (
        <div className={classes.main}>
            <TimerContextWrap>
                <AudioSelectContextWrap>
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
                    <AudioSelect></AudioSelect>
                </AudioSelectContextWrap>
                <TimerButton></TimerButton>
            </TimerContextWrap>

        </div>
    );
};

export default MainPage;
