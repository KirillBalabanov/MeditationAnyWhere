import React, {FC, useCallback, useState} from 'react';
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import classes from "./AudioSelect.module.css";
import Slider from "../../slider/Slider";
import AudioSelectLibrary from "./AudioSelectLibrary";
import {useFetching, useFetchingOnCondition} from "../../../hooks/useFetching";
import {AudioI, ErrorI} from "../../../types/types";
import AudioSelectLibraryAudio from "./AudioSelectLibraryAudio";
import {useAuthContext} from "../../../context/AuthContext";
import {Link} from "react-router-dom";
import Loader from "../../loader/Loader";

const AudioSelect: FC = () => {
    const [selectShown, setSelectShown] = useState(false);

    const authContext = useAuthContext();

    const [serverAudioIsLoading, setServerAudioIsLoading] = useState(true);
    const [serverAudioData, setServerAudioData] = useState<AudioI[] | null | ErrorI>(null);
    useFetching("/server/audio/default", setServerAudioIsLoading, setServerAudioData);

    const [userAudioIsLoading, setUserAudioIsLoading] = useState(true);
    const [userAudioData, setUserAudioData] = useState<AudioI[] | null | ErrorI>(null);
    useFetchingOnCondition("/user/audio/get", setUserAudioIsLoading, setUserAudioData, authContext?.auth!);

    const selectShownToggle = useCallback(() => {
        setSelectShown(prev => !prev);
    }, []);

    return (
        <div className={selectShown ? classes.select + " " + classes.selectShown : classes.select}>
            <div className={classes.title}>
                <div className={classes.titleInner} onClick={selectShownToggle}>
                    <img src={selectAudioIcon} alt=""/>
                    <p className={classes.titleText}>Select your audio</p>
                </div>
            </div>
            <Slider>
                <AudioSelectLibrary title={"Your library"}>
                    {
                        authContext?.auth
                            ?
                            (
                                Array.isArray(userAudioData)
                                    ?
                                    userAudioData.map(data => {
                                        return (
                                            <AudioSelectLibraryAudio title={data.audioTitle} url={data.audioUrl}
                                                                     key={data.audioUrl}
                                            ></AudioSelectLibraryAudio>
                                        )
                                    })
                                    :
                                    (
                                        userAudioIsLoading
                                            ?
                                        <Loader></Loader>
                                            :
                                            <div className={classes.libraryError}>
                                                {userAudioData?.errorMsg}
                                            </div>
                                    )
                            )
                            :
                            <div className={classes.libraryLogin}>
                                <Link to={"/login"} className={classes.libraryLoginLink}>login to have your own
                                    library.</Link>
                            </div>
                    }
                </AudioSelectLibrary>
                <AudioSelectLibrary title={"Default library"}>
                    {
                        Array.isArray(serverAudioData)
                            ?
                            serverAudioData.map(data => {
                                return (
                                    <AudioSelectLibraryAudio title={data.audioTitle} url={data.audioUrl}
                                                             key={data.audioUrl}
                                    ></AudioSelectLibraryAudio>
                                )
                            })
                            :
                            (
                                serverAudioIsLoading
                                    ?
                                    <Loader/>
                                    :
                                    <div className={classes.libraryError}>
                                        {serverAudioData?.errorMsg}
                                    </div>
                            )
                    }
                </AudioSelectLibrary>
            </Slider>
        </div>
    );
};

export default AudioSelect;