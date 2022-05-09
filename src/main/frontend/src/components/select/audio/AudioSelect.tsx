import React, {useContext, useEffect, useState} from 'react';
import classes from "./AudioSelect.module.css";
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import Slider from "../../slider/Slider";
import AudioSelectItem from "./AudioSelectItem";
import {AuthContext} from "../../../context/AuthContext";
import {useFetching} from "../../../hooks/useFetching";
import Loader from "../../loader/Loader";
import {AudioI, ErrorI} from "../../../types/types";

interface AudioSelectProps {
    setAudioData: (el: any) => void
}

const AudioSelect = ({setAudioData}: AudioSelectProps) => {
    const [isToggled, setIsToggled] = useState(false);
    const authContext = useContext(AuthContext);

    const [isLoadingServer, setIsLoadingServer] = useState(true);
    const [serverAudio, setServerAudio] = useState<AudioI[] | null | ErrorI>(null);
    const fetchedServerAudio = useFetching("/server/audio/default", setIsLoadingServer, setServerAudio);

    const [userAudio, setUserAudio] = useState([{audioUrl: "", audioTitle: ""}]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [fetchedUserAudio, setFetchedUserAudio] = useState(true);
    const [errorMsgUserAudio, setErrorMsgUserAudio] = useState("");

    const [isPlaying, setIsPlaying] = useState(false);

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
                                        <AudioSelectItem isPlayingLibrary={isPlaying}
                                                         setIsPlayingLibrary={setIsPlaying}
                                                         url={el.audioUrl} title={el.audioTitle}
                                                         setAudioData={setAudioData}
                                                         key={el.audioUrl}></AudioSelectItem>
                                    )
                                })
                                :
                                <div className={classes.libraryError}>
                                    {errorMsgUserAudio}
                                </div>
                    }
                </div>
                {
                    serverAudio != null
                    &&
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
                                    Array.isArray(serverAudio) && serverAudio.length != 0 && "audioTitle" in serverAudio[0] && serverAudio.map((el) => {
                                        return (
                                            <AudioSelectItem isPlayingLibrary={isPlaying}
                                                             setIsPlayingLibrary={setIsPlaying}
                                                             url={el.audioUrl} title={el.audioTitle}
                                                             setAudioData={setAudioData}
                                                             key={el.audioUrl}></AudioSelectItem>
                                        )
                                    })
                                    :
                                    <div className={classes.libraryError}>
                                        {"error" in serverAudio && serverAudio.error}
                                    </div>
                        }
                    </div>
                }
            </Slider>

        </div>
    );
};

export default AudioSelect;