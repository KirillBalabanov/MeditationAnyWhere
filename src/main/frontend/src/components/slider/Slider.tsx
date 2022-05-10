import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import classes from "./Slider.module.css";

interface SliderProps {
    children: React.ReactNode,
    elementWidth: number,
    amountOfElements: number
}

const Slider: FC<SliderProps> = React.memo(({children, amountOfElements, elementWidth}) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isMouseDragging, setIsMouseDragging] = useState(false);
    const [startPosition, setStartPosition] = useState(0);

    const leftBoundary = useMemo(() => (elementWidth / 2) - 1, []);
    const rightBoundary = useMemo(() => (-(elementWidth*(amountOfElements-1) + elementWidth/2)) + 1, []);

    const sliderDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mouseDownHandler = (e: MouseEvent) => {
            e.preventDefault()
            setIsMouseDragging(true)
            setStartPosition(e.pageX);
        }

        const touchStartHandler = (e: TouchEvent) => setStartPosition(e.touches[0].pageX);

        sliderDiv.current!.addEventListener("mousedown", mouseDownHandler);
        sliderDiv.current!.addEventListener("touchstart", touchStartHandler);

        return () => {
            sliderDiv.current!.removeEventListener("mousedown", mouseDownHandler);
            sliderDiv.current!.removeEventListener("touchstart", touchStartHandler);
        };
    }, []);

    useEffect(() => {
        const mouseUpHandler =(e: MouseEvent) => {
            setIsMouseDragging(false);
            draggingStop();
        }
        window.addEventListener("mouseup", mouseUpHandler);
        return () => window.removeEventListener("mouseup", mouseUpHandler);
    }, [currentTranslate]);

    const currentSlideTranslate = useMemo(() => {
        return currentSlide * -elementWidth;
    }, [currentSlide]);

    const mouseMove = useCallback((newMousePosition: number) => {
        if (!isMouseDragging) {
            return;
        }
        moveSlider(newMousePosition);
    }, [isMouseDragging, currentSlideTranslate]);

    const moveSlider = useCallback((newMousePosition: number) => {
        let newTrans = currentSlideTranslate + newMousePosition - startPosition;
        if(newTrans > leftBoundary) return;
        if(newTrans < rightBoundary) return;
        setCurrentTranslate( newTrans);
    }, [isMouseDragging, currentSlideTranslate]);

    const draggingStop = useCallback(() => {
        const moved = Math.abs(currentTranslate - currentSlideTranslate);
        if (moved < elementWidth / 2) { // don't flip
            setCurrentTranslate(currentSlideTranslate);
            return;
        }
        if(currentTranslate < currentSlideTranslate)  { // flip to next
            setCurrentSlide(currentSlide + 1);
            setCurrentTranslate((currentSlide + 1) * -elementWidth);
            return;
        }
        setCurrentSlide(currentSlide - 1); // flip to prev
        setCurrentTranslate((currentSlide - 1) * -elementWidth);

    }, [currentTranslate]);

    return (
        <div className={classes.slider} style={{width: elementWidth + "px"}} ref={sliderDiv}
             onTouchEnd={draggingStop}
             onMouseMove={(e) => mouseMove(e.pageX)}
             onTouchMove={(e) => moveSlider(e.touches[0].pageX)}
        >
            <div className={classes.sliderInner}
                 style={{
                     width: elementWidth * amountOfElements + "px",
                     transform: "translateX(" + currentTranslate + "px)"
                 }}
                 ref={sliderRef}>
                {children}
            </div>
            <div className={classes.dots}>
                {Array.from({length: amountOfElements}, (a, index) =>
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
});

export default Slider;