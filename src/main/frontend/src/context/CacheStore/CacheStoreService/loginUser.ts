import {AuthActionTypes} from "../../../reducer/authReducer";
import {UserActionTypes} from "../../../reducer/userReducer";
import {StoreContextI} from "../StoreContext";
import {PrincipalI} from "../../../types/serverTypes";

export const loginUser = (principal: PrincipalI, cacheStore: StoreContextI) => {
    const [, authDispatcher] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;
    userDispatcher({type: UserActionTypes.RESET_ALL} )
    authDispatcher({type: AuthActionTypes.LOGIN})
    userDispatcher({type: UserActionTypes.SET_PRINCIPAL, payload: principal})
}