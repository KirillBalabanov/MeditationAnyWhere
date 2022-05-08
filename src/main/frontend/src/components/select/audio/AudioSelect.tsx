import React, {useContext, useEffect, useState} from 'react';
import classes from "./AudioSelect.module.css";
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import Slider from "../../slider/Slider";
import LibraryItem from "./LibraryItem";
import {AuthContext} from "../../../context/AuthContext";
import {Link} from "react-router-dom";
import {useFetching} from "../../../hooks/useFetching";
import Loader from "../../loader/Loader";

const AudioSelect = () => {
    const [isToggled, setIsToggled] = useState(false);
    const authContext = useContext(AuthContext);

    const [isLoadingServer, setIsLoadingServer] = useState(true);
    const [serverAudio, setServerAudio] = useState([{audioUrl: "", audioTitle: ""}]);
    const[fetchedServerAudio, errorMsgServerAudio] = useFetching("/server/audio/default", setServerAudio, setIsLoadingServer)

    const [userAudio, setUserAudio] = useState([{audioUrl: "", audioTitle: ""}]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [fetchedUserAudio, setFetchedUserAudio] = useState(true);
    const [errorMsgUserAudio, setErrorMsgUserAudio] = useState("");

    useEffect(() => {
        if (authContext?.auth) {
            fetch("/user/audio/get").then((response) => response.json()).then((data) => {
                if ("error" in data) {
                    setErrorMsgUserAudio(data["error"]);
                    setFetchedUserAudio(false);
                    return;
                }
                setUserAudio(data);
                setIsLoadingUser(false);
            });
        }
    }, []);

    return (
        <div className={isToggled ? classes.select + " " + classes.selectToggled : classes.select}>
            <div className={classes.title}>
                <div className={classes.titleInner} onClick={() => setIsToggled(!isToggled)}>
                    <img src={selectAudioIcon} alt=""/>
                    <p className={classes.titleText}>Select your audio</p>
                </div>
            </div>
            <Slider width={350} amountOfElements={2}>
                <div className={classes.library}>
                    <div className={classes.libraryTitle}>
                        Your library
                    </div>
                    {
                        isLoadingUser
                            ?
                            <Loader/>
                            :

                            fetchedUserAudio
                                ?
                                userAudio.map((el) => {
                                    return (
                                        <LibraryItem url={el.audioUrl} title={el.audioTitle} key={el.audioUrl}></LibraryItem>
                                    )
                                })
                                :
                                <div className={classes.libraryError}>
                                    {errorMsgUserAudio}
                                </div>
                    }
                </div>
                <div className={classes.library}>
                    <div className={classes.libraryTitle}>
                        Default library
                    </div>
                    {
                        isLoadingServer
                            ?
                            <Loader/>
                            :

                            fetchedServerAudio
                                ?
                                serverAudio.map((el) => {
                                    return (
                                        <LibraryItem url={el.audioUrl} title={el.audioTitle} key={el.audioUrl}></LibraryItem>
                                    )
                                })
                                :
                                <div className={classes.libraryError}>
                                    {errorMsgServerAudio}
                                </div>
                    }
                </div>
            </Slider>

        </div>
    );
};

export default AudioSelect;