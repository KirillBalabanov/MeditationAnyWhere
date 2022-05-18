import {AuthActionTypes} from "../../../reducer/authReducer";
import {UserActionTypes} from "../../../reducer/userReducer";
import {CacheStoreContextI} from "../CacheStoreContext";
import {HeaderActionTypes} from "../../../reducer/headerReducer";

export const loginUser = (username: string, cacheStore: CacheStoreContextI) => {
    const [, authDispatcher] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;
    const [, headerDispatcher] = cacheStore.headerReducer
    userDispatcher({type: UserActionTypes.RESET_ALL} )
    authDispatcher({type: AuthActionTypes.LOGIN})
    userDispatcher({type: UserActionTypes.SET_USERNAME, payload: username})
    headerDispatcher({type: HeaderActionTypes.RELOAD_HEADER})
}