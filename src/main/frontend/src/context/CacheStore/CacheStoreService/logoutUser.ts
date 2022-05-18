import {CacheStoreContextI} from "../CacheStoreContext";
import {UserActionTypes} from "../../../reducer/userReducer";
import {HeaderActionTypes} from "../../../reducer/headerReducer";
import {AuthActionTypes} from "../../../reducer/authReducer";

export const logoutUser = (cacheStore: CacheStoreContextI) => {
    const [, authDispatcher] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;
    const [, headerDispatcher] = cacheStore.headerReducer;

    authDispatcher({type: AuthActionTypes.LOGOUT})
    userDispatcher({type: UserActionTypes.RESET_ALL}) // reset cache
    headerDispatcher({type: HeaderActionTypes.RELOAD_HEADER})
};