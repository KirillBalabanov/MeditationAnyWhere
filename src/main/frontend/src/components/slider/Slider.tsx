import React, {useEffect, useRef, useState} from 'react';
import classes from "./Slider.module.css";

interface SliderProps {
    children: React.ReactNode,
    width: number,
    amountOfElements: number
}

const Slider = ({children, width, amountOfElements}: SliderProps) => {
    const [sliderCur, setSliderCur] = useState(0);
    const sliderInner = useRef<HTMLDivElement>(null);
    const [xPrev, setXPrev] = useState(0);
    const [curPos, setCurPos] = useState(0);
    const leftBoundary = -(width / 2);
    const rightBoundary = (width*(amountOfElements-1) + width/2);

    useEffect(() => {
        // @ts-ignore
        sliderInner.current.style.right = curPos + "px";
    }, [curPos]);

    const setSliderCurrent = (newInd: number) => {
        if(newInd <= 0) {
            setSliderCur(0);
            setCurPos(0);
        }
        else if (newInd >= amountOfElements - 1) {
            setCurPos(width*(amountOfElements - 1));
            setSliderCur(amountOfElements - 1);
        }
        else {
            setSliderCur(newInd);
            setCurPos((newInd-1) * width);
        }
    }

    useEffect(() => {
        setCurPos(sliderCur * width);
    }, [sliderCur]);

    return (
        <div className={classes.slider} style={{width: width + "px"}}
             onTouchStart={(e) => {
                 setXPrev(e.touches[0].pageX);
             }}
             onTouchMove={(e) => {
                 let end = e.touches[0].pageX;
                 let np = curPos - (end - xPrev);
                 if (np < leftBoundary) np = leftBoundary;
                 if (np > rightBoundary) np = rightBoundary;
                 setCurPos(np);
                 setXPrev(end);
             }}
             onTouchEnd={() => {
                 let start = sliderCur * width;
                 if (Math.abs(start - curPos) > width / 2) {
                     if (curPos > start) setSliderCurrent(sliderCur + 1);
                     else setSliderCurrent(sliderCur - 1);
                 } else setSliderCurrent(sliderCur);
             }}
             onMouseDown={(e) => {
                 setXPrev(e.pageX);
             }}
        >
            <div className={classes.sliderInner} style={{width: width * amountOfElements + "px"}} ref={sliderInner}>
                {children}
            </div>
            <div className={classes.dots}>
                {Array.from({length: amountOfElements}, (a, index) =>
                    <div className={index === sliderCur ? classes.dot + " " + classes.dotCur : classes.dot} key={index}
                         onClick={() => {
                             setSliderCur(index)
                         }}
                    >
                    </div>)}
            </div>
        </div>
    );
};

export default Slider;