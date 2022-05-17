export enum CsrfActionTypes {
    SET_TOKEN,
}

interface CsrfSetTokenAction {
    type: CsrfActionTypes.SET_TOKEN,
    payload: string,
}



export type CsrfAction = CsrfSetTokenAction;

export interface CsrfState {
    csrfToken: string | null,
}

export const csrfReducer = (state: CsrfState, action: CsrfAction): CsrfState => {
    switch (action.type) {
        case CsrfActionTypes.SET_TOKEN:
            return {...state, csrfToken: action.payload}

        default:
            return state;
    }
};