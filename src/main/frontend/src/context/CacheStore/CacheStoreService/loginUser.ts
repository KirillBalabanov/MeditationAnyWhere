import {AuthActionTypes} from "../../../reducer/authReducer";
import {UserActionTypes} from "../../../reducer/userReducer";
import {CacheStoreContextI} from "../CacheStoreContext";
import {CsrfActionTypes} from "../../../reducer/csrfReducer";
import {HeaderActionTypes} from "../../../reducer/headerReducer";

export const loginUser = (username: string, csrf: string, cacheStore: CacheStoreContextI) => {
    const [, authDispatcher] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;
    const [, csrfDispatcher] = cacheStore.csrfReducer
    const [, headerDispatcher] = cacheStore.headerReducer
    authDispatcher({type: AuthActionTypes.LOGIN})
    userDispatcher({type: UserActionTypes.RESET_ALL} )
    userDispatcher({type: UserActionTypes.SET_USERNAME, payload: username})
    csrfDispatcher({type: CsrfActionTypes.SET_TOKEN, payload: csrf})
    headerDispatcher({type: HeaderActionTypes.RELOAD_HEADER})

}