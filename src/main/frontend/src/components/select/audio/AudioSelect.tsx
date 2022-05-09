import React, {useContext, useState} from 'react';
import classes from "./AudioSelect.module.css";
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import Slider from "../../slider/Slider";
import AudioSelectItem from "./AudioSelectItem";
import {AuthContext} from "../../../context/AuthContext";
import {useFetching, useFetchingOnCondition} from "../../../hooks/useFetching";
import Loader from "../../loader/Loader";
import {AudioI, ErrorI} from "../../../types/types";
import {Link} from "react-router-dom";

interface AudioSelectProps {
    setAudioPlaying: (el: React.RefObject<HTMLAudioElement>) => void
}

const AudioSelect = ({setAudioPlaying}: AudioSelectProps) => {
    const [isToggled, setIsToggled] = useState(false);
    const authContext = useContext(AuthContext);

    const [isLoadingServer, setIsLoadingServer] = useState(true);
    const [serverAudio, setServerAudio] = useState<AudioI[] | null | ErrorI>(null);
    useFetching("/server/audio/default", setIsLoadingServer, setServerAudio);

    const [userAudio, setUserAudio] = useState<AudioI[] | null | ErrorI>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    useFetchingOnCondition("/user/audio/get", setIsLoadingUser, setUserAudio, authContext!.auth);

    const [isPlaying, setIsPlaying] = useState(false);
    console.log("select");
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
                            !authContext?.auth
                                ?
                                <div className={classes.libraryLogin}>
                                    <Link to={"/login"} className={classes.libraryLoginLink}>login to have your own library.</Link>
                                </div>
                                :
                                    (
                                        Array.isArray(userAudio)
                                            ?
                                            userAudio.map((el) => {
                                                return (
                                                    <AudioSelectItem isPlayingLibrary={isPlaying}
                                                                     setIsPlayingLibrary={setIsPlaying}
                                                                     url={el.audioUrl} title={el.audioTitle}
                                                                     setAudioPlaying={setAudioPlaying}
                                                                     key={el.audioUrl}></AudioSelectItem>
                                                )
                                            })
                                            :
                                            <div className={classes.libraryError}>
                                                {userAudio?.errorMsg}
                                            </div>)
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
                                Array.isArray(serverAudio)
                                    ?
                                    Array.isArray(serverAudio) && serverAudio.length != 0 && "audioTitle" in serverAudio[0] && serverAudio.map((el) => {
                                        return (
                                            <AudioSelectItem isPlayingLibrary={isPlaying}
                                                             setIsPlayingLibrary={setIsPlaying}
                                                             url={el.audioUrl} title={el.audioTitle}
                                                             setAudioPlaying={setAudioPlaying}
                                                             key={el.audioUrl}></AudioSelectItem>
                                        )
                                    })
                                    :
                                    <div className={classes.libraryError}>
                                        {serverAudio.errorMsg}
                                    </div>
                        }
                    </div>
                }
            </Slider>

        </div>
    );
};

export default AudioSelect;