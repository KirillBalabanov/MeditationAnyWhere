import React from 'react';
import Header from "../components/header/Header";
import Timer from "../components/timer/Timer";

const MainPage = () => {

    return (
        <div>
            <Header></Header>
            <div className="container">
                <Timer></Timer>
            </div>
        </div>
    );
};

export default MainPage;