import React, {FC} from 'react';
import sadSmile from "../../images/sadSmile.svg";
import {Link} from "react-router-dom";

interface Error404Props {
    errorMsg?: any
}

const ErrorPage: FC<Error404Props> = React.memo(({errorMsg}) => {
    return (
        <div className="error404">
            <div className="error404__text">
                {errorMsg
                ?
                errorMsg.toString()
                :
                "404 page not found."}
            </div>
            <img src={sadSmile} alt="sad smile" className="error404__image"/>
            <Link to={"/"} className="error404__link">Go to main page</Link>
        </div>
    );
});

export default ErrorPage;