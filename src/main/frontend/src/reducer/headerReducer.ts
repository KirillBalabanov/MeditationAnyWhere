export enum HeaderActionTypes {
    SHOW_HEADER,
    HIDE_HEADER,
}

interface HeaderShowAction {
    type: HeaderActionTypes.SHOW_HEADER
}

interface HeaderHideAction {
    type: HeaderActionTypes.HIDE_HEADER,
}

export type HeaderAction = HeaderShowAction | HeaderHideAction;

export interface HeaderState {
    showHeader: boolean,
    reloadHeader: boolean,
}

export const headerReducer = (state: HeaderState, action: HeaderAction): HeaderState => {
    switch (action.type) {
        case HeaderActionTypes.SHOW_HEADER:
            return {...state, showHeader: true}
        case HeaderActionTypes.HIDE_HEADER:
            return {...state, showHeader: false}

        default:
            return state;
    }
};