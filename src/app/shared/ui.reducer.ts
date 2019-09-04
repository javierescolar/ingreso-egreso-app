import * as fromUI from './ui.actions'

export interface State {
    isLoading: boolean;
}

const initialState: State = {
    isLoading: false
}


export function reducerUI(state = initialState, action: fromUI.acciones){
    switch (action.type) {
        case fromUI.ACTIVAR_LOADING:
            return {...state, isLoading: true};
        case fromUI.DESACTIVAR_LOADING:
            return {...state, isLoading: false};
        default:
            return state;
    }

}