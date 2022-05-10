import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import classes from "./Slider.module.css";

interface SliderProps {
    children: React.ReactNode,
}

const Slider: FC<SliderProps> = React.memo(({children}) => {
    const sliderInner = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isMouseDragging, setIsMouseDragging] = useState(false);
    const [startPosition, setStartPosition] = useState(0);

    const [amountOfElements, setAmountOfElements] = useState(0);
    const [elementWidth, setElementWidth] = useState(0);

    const leftBoundary = useMemo(() => (elementWidth / 2) - 1, [elementWidth]);
    const rightBoundary = useMemo(() => (-(elementWidth*(amountOfElements-1) + elementWidth/2)) + 1, [elementWidth]);

    const sliderDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mouseDownHandler = (e: MouseEvent) => {
            e.preventDefault()
            setIsMouseDragging(true)
            setStartPosition(e.pageX);
        }

        const touchStartHandler = (e: TouchEvent) => setStartPosition(e.touches[0].pageX);

        let sliderDivRef = sliderDiv.current!;

        setAmountOfElements(sliderInner.current!.children.length);
        setElementWidth(sliderInner.current!.offsetWidth / sliderInner.current!.children.length);

        sliderDivRef.addEventListener("mousedown", mouseDownHandler);
        sliderDivRef.addEventListener("touchstart", touchStartHandler);

        return () => {

            sliderDivRef.removeEventListener("mousedown", mouseDownHandler);
            sliderDivRef.removeEventListener("touchstart", touchStartHandler);
        };
    }, []);

    useEffect(() => {
        const mouseUpHandler = () => {
            setIsMouseDragging(false);
            draggingStop();
        }
        const mouseMoveHandler = (e: MouseEvent) => mouseMove(e.pageX)
        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseup", mouseUpHandler);
        return () => {
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseup", mouseUpHandler);
        }
    }, [currentTranslate, isMouseDragging]);

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
        if(Math.abs(newTrans) > Math.abs(currentSlideTranslate) + elementWidth) return;
        setCurrentTranslate(newTrans);
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
        <div className={classes.slider} style={{width: elementWidth != 0 ? elementWidth + "px" : "auto"}} ref={sliderDiv}
             onTouchEnd={draggingStop}
             onTouchMove={(e) => moveSlider(e.touches[0].pageX)}
        >
            <div className={classes.sliderInner}
                 style={{
                     width: elementWidth != 0 ? elementWidth * amountOfElements + "px" : "auto",
                     transform: "translateX(" + currentTranslate + "px)"
                 }}
                 ref={sliderInner}>
                {children}
            </div>
            <div className={classes.dots}>
                {
                    amountOfElements!=0&&Array.from({length: amountOfElements}, (a, index) =>
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