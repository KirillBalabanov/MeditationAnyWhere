import React, {useState} from 'react';
import sadSmile from "../images/sad_smile.svg";

interface Error404Props {
    errorMsg?: any
}

const Error = ({errorMsg} : Error404Props) => {
    return (
        <div className={"error404"}>
            <div className="error404__text">
                {errorMsg
                ?
                errorMsg.toString()
                :
                "404 page not found."}
            </div>
            <img src={sadSmile} alt="sad smile" className="error404__image"/>
        </div>
    );
};

export default Error;