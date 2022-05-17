import {CacheStoreContextI} from "../CacheStoreContext";
import {CsrfActionTypes} from "../../../reducer/csrfReducer";
import {UserActionTypes} from "../../../reducer/userReducer";
import {HeaderActionTypes} from "../../../reducer/headerReducer";
import {AuthActionTypes} from "../../../reducer/authReducer";

export const logoutUser = (cacheStore: CacheStoreContextI, newToken: string) => {
    const [, authDispatcher] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;
    const [, csrfDispatcher] = cacheStore.csrfReducer;
    const [, headerDispatcher] = cacheStore.headerReducer;

    authDispatcher({type: AuthActionTypes.LOGOUT})
    csrfDispatcher({type: CsrfActionTypes.SET_TOKEN, payload: newToken})
    userDispatcher({type: UserActionTypes.RESET_ALL}) // reset cache
    headerDispatcher({type: HeaderActionTypes.RELOAD_HEADER})
};