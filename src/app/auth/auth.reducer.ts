import * as fromAuth from './auth.actions';
import { User } from './user.model';
import { SET_USER } from './auth.actions';

export interface AuthState {
    user: User;
}


const initState: AuthState = {
    user: null
}

export function reducerAuth(state=initState, action: fromAuth.acciones): AuthState{
    switch(action.type){
        case SET_USER:
            return {...state, user: action.user};
        default:
            return state;
    }
}