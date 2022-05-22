import React, {FC, useEffect, useState} from 'react';
import selectAudioIcon from "../../../images/selectAudioIcon.svg";
import classes from "./AudioSelect.module.css";
import Slider from "../../slider/Slider";
import AudioSelectLibrary from "./AudioSelectLibrary";
import AudioSelectLibraryAudio from "./AudioSelectLibraryAudio";
import {Link} from "react-router-dom";
import Loader from "../../loader/Loader";
import {useCacheStore} from "../../../context/CacheStore/CacheStoreContext";
import {AudioFetchI, ErrorFetchI} from "../../../types/serverTypes";
import {UserActionTypes} from "../../../reducer/userReducer";
import {ServerActionTypes} from "../../../reducer/serverReducer";

const AudioSelect: FC = () => {
    const [selectShown, setSelectShown] = useState(false);

    const cacheStore = useCacheStore()!;
    const [authState] = cacheStore.authReducer;
    const [userState, userDispatcher] = cacheStore.userReducer;
    const [serverState, serverDispatcher] = cacheStore.serverReducer;

    const [serverAudioIsLoading, setServerAudioIsLoading] = useState(true);

    const [userAudioIsLoading, setUserAudioIsLoading] = useState(true);

    useEffect(() => {
        // server audio url
        if (serverState.defaultAudio !== null) { // is in cache
            setServerAudioIsLoading(false);
        } else {
            fetch("/server/audio/default").then((response) => response.json()).then((data: AudioFetchI[] | ErrorFetchI) => {
                if("errorMsg" in data) return;
                serverDispatcher({type: ServerActionTypes.ADD_DEFAULT_AUDIO, payload: data.map(el => {
                        return {url: el.audioUrl, title: el.audioTitle}
                    })})
            }).catch(() => { // catch in case server return null
                userDispatcher({type: UserActionTypes.SET_AUDIO, payload: []})
            }).then(() => setServerAudioIsLoading(false));
        }

        // user audio url
        if (userState.audio !== null || !authState.auth) { // is in cache or user not authenticated
            setUserAudioIsLoading(false);
        } else {
            fetch("/user/audio/get").then((response) => response.json()).then((data: AudioFetchI[] | ErrorFetchI) => {
                if("errorMsg" in data) return;
                userDispatcher({type: UserActionTypes.SET_AUDIO, payload: data.map(el => {
                        return {url: el.audioUrl, title: el.audioTitle}
                    })})
            }).catch(() => { // catch in case server return null
                userDispatcher({type: UserActionTypes.SET_AUDIO, payload: []})
            }).then(() => setUserAudioIsLoading(false));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className={selectShown ? classes.select + " " + classes.selectShown : classes.select}>
            <div className={classes.title}>
                <div className={classes.titleInner} onClick={() => setSelectShown(prev => !prev)}>
                    <img src={selectAudioIcon} className={classes.selectImg} alt=""/>
                    <p className={classes.titleText}>Select your audio</p>
                </div>
            </div>
            <Slider>
                <AudioSelectLibrary title={"Your library"}>
                    {
                        userAudioIsLoading
                            ?
                            <Loader/>
                            :
                            authState.auth
                                ?
                                (
                                    userState.audio !== null && userState.audio.length >= 1
                                        ?
                                        userState.audio.map(data => {
                                            return (
                                                <AudioSelectLibraryAudio title={data.title} url={data.url}
                                                                         key={data.url}
                                                ></AudioSelectLibraryAudio>
                                            )
                                        })
                                        :
                                        <div className={classes.libraryLinkOuter}>
                                            <Link to={"/settings/library"} className={classes.libraryLink}>Add new
                                                tracks.</Link>
                                        </div>

                                )
                                :
                                <div className={classes.libraryLinkOuter}>
                                    <Link to={"/login"} className={classes.libraryLink}>login to have your own
                                        library.</Link>
                                </div>
                    }
                </AudioSelectLibrary>
                <AudioSelectLibrary title={"Default library"}>
                    {
                        serverAudioIsLoading
                            ?
                            <Loader/>
                            :
                            serverState.defaultAudio !== null && serverState.defaultAudio.length >= 1
                                ?
                                serverState.defaultAudio.map(data => {
                                    return (
                                        <AudioSelectLibraryAudio title={data.title} url={data.url}
                                                                 key={data.url}
                                        ></AudioSelectLibraryAudio>
                                    )
                                })
                                :
                                <div className={classes.libraryLinkOuter}>
                                    Server has no audio.
                                </div>
                    }
                </AudioSelectLibrary>
            </Slider>
        </div>
    );
};

export default AudioSelect;