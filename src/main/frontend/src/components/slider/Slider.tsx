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

    const currentSlideTranslate = useMemo(() => {
        return currentSlide * -elementWidth;
    }, [currentSlide]);

    const mouseMove = useCallback((newMousePosition: number) => {
        if (!isMouseDragging) {
            return;
        }

        setCurrentTranslate( currentSlideTranslate + newMousePosition - startPosition);
    }, [isMouseDragging, currentSlideTranslate]);

    useEffect(() => {
        const mouseUpHandler = () => {
            setIsMouseDragging(false);
        };
        window.addEventListener("mouseup", mouseUpHandler);
        return () => window.removeEventListener("mouseup", mouseUpHandler);
    }, []);

    return (
        <div className={classes.slider} style={{width: elementWidth  + "px"}}
             onMouseDown={(e) => {
                 e.preventDefault()
                 setIsMouseDragging(true)
                 setStartPosition(e.pageX);
             }}
             onMouseMove={(e) => mouseMove(e.pageX)}
        >
            <div className={classes.sliderInner}
                 style={{width: elementWidth * amountOfElements + "px", transform: "translateX(" + currentTranslate + "px)"}}
                 ref={sliderRef}>
                {children}
            </div>
            <div className={classes.dots}>
                {Array.from({length: amountOfElements}, (a, index) =>
                    <div className={index === currentSlide ? classes.dot + " " + classes.dotCur : classes.dot} key={index}
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