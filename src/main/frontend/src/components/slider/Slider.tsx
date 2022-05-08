import React, {useEffect, useRef, useState} from 'react';
import classes from "./Slider.module.css";

interface SliderProps {
    children: React.ReactNode,
    width: number,
    amountOfElements: number
}

let dragging = false;
let currentSlideIndex = 0;
let startPosition = 0;
let prevTranslate = 0;
let currentTranslate = 0;

const Slider = ({children, width, amountOfElements}: SliderProps) => {
    const sliderInner = useRef<HTMLDivElement>(null);

    const [sliderCur, setSliderCur] = useState(0); // for dots
    const [translateRight, setTranslateRight] = useState(0); // sliderInner translateX

    const leftBoundary = width / 2;
    const rightBoundary = -(width*(amountOfElements-1) + width/2);

    function moveHandler(pgx: number) {
        currentTranslate = prevTranslate + pgx - startPosition;
        if(currentTranslate > leftBoundary) return;
        if(currentTranslate < rightBoundary) return;
        setRightScroll(currentTranslate);
    }

    function upHandler() {
        const moved = Math.abs(currentTranslate - prevTranslate);
        if (moved < width / 2) { // don't flip
            setSlide(currentSlideIndex);
        } else {
            if(currentTranslate < prevTranslate)  { // flip to next
                setSlide(currentSlideIndex + 1);
            }
            else {
                setSlide(currentSlideIndex -  1); // flip to prev
            }
        }
    }

    function setSlide(i: number) {
        if(i <= 0) currentSlideIndex = 0;
        else if (i >= amountOfElements - 1) currentSlideIndex = amountOfElements - 1;
        else currentSlideIndex = i;

        setSliderCur(currentSlideIndex);
        prevTranslate = (-currentSlideIndex) * width;
        setTranslateRight(prevTranslate);
    }

    function setRightScroll(n: number) {
        setTranslateRight(n);
    }

    const mouseMoveHandler =(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragging) {
            moveHandler(e.pageX);
        }
    }
    const mouseUpHandler = (e: MouseEvent) => {
        dragging = false;
        upHandler();
    }
    useEffect(() => {
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, []);


    return (
        <div className={classes.slider} style={{width: width + "px"}}
             onMouseDown={(e) => {
                 startPosition = e.pageX;
                 dragging = true;
             }}
             onWheel={(e) => {
                 if(e.deltaX < 0) {
                     setSlide(sliderCur - 1)
                 }
                 if (e.deltaX > 0) {
                     setSlide(sliderCur + 1);
                 }
             }}
             onTouchStart={(e) => {
                 startPosition = e.touches[0].pageX;
             }}
             onTouchMove={(e) => {
                 moveHandler(e.touches[0].pageX);
             }}
             onTouchEnd={(e) => upHandler()}
        >
            <div className={classes.sliderInner}
                 style={{width: width * amountOfElements + "px", transform: "translateX(" + translateRight + "px)"}}
                 ref={sliderInner}>
                {children}
            </div>
            <div className={classes.dots}>
                {Array.from({length: amountOfElements}, (a, index) =>
                    <div className={index === sliderCur ? classes.dot + " " + classes.dotCur : classes.dot} key={index}
                         onClick={() => {
                             setSlide(index)
                         }}
                    >
                    </div>)}
            </div>
        </div>
    );
};

export default Slider;