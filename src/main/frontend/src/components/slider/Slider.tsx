import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import classes from "./Slider.module.css";

interface SliderProps {
    children: React.ReactNode,
}

const Slider: FC<SliderProps> = ({children}) => {
    const sliderInner = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isMouseDragging, setIsMouseDragging] = useState(false);
    const [startPosition, setStartPosition] = useState(0);

    const [amountOfElements, setAmountOfElements] = useState(0);
    const [elementWidth, setElementWidth] = useState(0);

    const leftBoundary = useMemo(() => (elementWidth / 2) - 1, [elementWidth]);
    const rightBoundary = useMemo(() => (-(elementWidth*(amountOfElements-1) + elementWidth/2)) + 1, [elementWidth, amountOfElements]);

    const sliderDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mouseDownHandler = (e: MouseEvent) => {
            setIsMouseDragging(true)
            setStartPosition(e.pageX);
        }

        const touchStartHandler = (e: TouchEvent) => setStartPosition(e.touches[0].pageX);

        let sliderDivRef = sliderDiv.current!;

        const setWidth = () => {
            setAmountOfElements(sliderInner.current!.children.length);
            setElementWidth(sliderInner.current!.offsetWidth / sliderInner.current!.children.length);
            setCurrentSlide(0);
            setCurrentTranslate(0);
        }

        setWidth();

        sliderDivRef.addEventListener("mousedown", mouseDownHandler);
        sliderDivRef.addEventListener("touchstart", touchStartHandler);

        window.addEventListener("resize", setWidth);

        return () => {
            window.removeEventListener("resize", setWidth);
            sliderDivRef.removeEventListener("mousedown", mouseDownHandler);
            sliderDivRef.removeEventListener("touchstart", touchStartHandler);
        };
    }, []);


    const currentSlideTranslate = useMemo(() => {
        return currentSlide * (-elementWidth);
    }, [currentSlide, elementWidth]);

    const draggingStop = useCallback(() => {
        const moved = Math.abs(currentTranslate - currentSlideTranslate);
        if (moved < elementWidth / 2) { // don't flip
            setCurrentTranslate(currentSlideTranslate);
            return;
        }
        if(currentTranslate < currentSlideTranslate)  { // flip to next
            setCurrentSlide(currentSlide => currentSlide + 1);
            setCurrentTranslate((currentSlide + 1) * -elementWidth);
            return;
        }
        setCurrentSlide(currentSlide => currentSlide - 1); // flip to prev
        setCurrentTranslate((currentSlide - 1) * -elementWidth);

    }, [currentTranslate, elementWidth, currentSlide, currentSlideTranslate]);

    const moveSlider = useCallback((newMousePosition: number) => {
        let newTrans = currentSlideTranslate + newMousePosition - startPosition;
        if(newTrans > leftBoundary) return;
        if(newTrans < rightBoundary) return;
        if(Math.abs(newTrans) > Math.abs(currentSlideTranslate) + elementWidth) return;
        setCurrentTranslate(newTrans);
    }, [currentSlideTranslate, elementWidth, leftBoundary, rightBoundary, startPosition]);


    const mouseMove = useCallback((newMousePosition: number) => {
        if (!isMouseDragging) {
            return;
        }
        moveSlider(newMousePosition);
    }, [isMouseDragging, moveSlider]);

    useEffect(() => {
        const mouseUpHandler = () => {
            if (isMouseDragging) {
                setIsMouseDragging(false);
                draggingStop();
            }
        }
        const mouseMoveHandler = (e: MouseEvent) => mouseMove(e.pageX)
        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseup", mouseUpHandler);
        return () => {
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseup", mouseUpHandler);
        }
    }, [currentTranslate, isMouseDragging, draggingStop, mouseMove]);


    return (
        <div className={classes.slider} ref={sliderDiv}
             onTouchEnd={draggingStop}
             onTouchMove={(e) => moveSlider(e.touches[0].pageX)}
        >
            <div className={classes.sliderInner}
                 style={{
                     transform: "translateX(" + currentTranslate + "px)"
                 }}
                 ref={sliderInner}>
                {children}
            </div>
            <div className={classes.dots}>
                {
                    amountOfElements!==0&&Array.from({length: amountOfElements}, (a, index) =>
                    <div className={index === currentSlide ? classes.dot + " " + classes.dotCur : classes.dot}
                         key={index}
                         onClick={() => {
                             setCurrentTranslate(-elementWidth * index);
                             setCurrentSlide(index)
                         }}
                    >
                    </div>)}
            </div>
        </div>
    );
};

export default Slider;