import {StoreContextI} from "../StoreContext";
import {UserActionTypes} from "../../../reducer/userReducer";
import {AuthActionTypes} from "../../../reducer/authReducer";

export const logoutUser = (cacheStore: StoreContextI) => {
    const [, authDispatcher] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;

    authDispatcher({type: AuthActionTypes.LOGOUT})
    userDispatcher({type: UserActionTypes.RESET_ALL}) // reset cache
};