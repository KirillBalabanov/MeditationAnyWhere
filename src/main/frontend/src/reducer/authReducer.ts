export enum AuthActionTypes {
    LOGIN, LOGOUT,
}

interface AuthLoginAction {
    type: AuthActionTypes.LOGIN
}
interface AuthActionLogout {
    type: AuthActionTypes.LOGOUT,
}



export type AuthAction = AuthLoginAction | AuthActionLogout;

export interface AuthState {
    auth: boolean,
}

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            return {
                ...state,
                auth: true,
            }
        case AuthActionTypes.LOGOUT:
            return {
                ...state,
                auth: false,
            }
        default:
            return state;
    }
};