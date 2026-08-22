import { createReducer, on } from '@ngrx/store';
import { UserDto } from '../../../models/user.model';
import * as AuthActions from './auth.action';

export interface AuthState {
    currentUser: UserDto | null;
    isLoading: boolean;
    error: string | null;
}

export const initialState: AuthState = {
    currentUser: null,
    isLoading: false,
    error: null
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.loadCurrentUser, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
        ...state,
        currentUser: user,
        isLoading: false
    })),

    on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),

    on(AuthActions.logoutSuccess, (state) => ({
        ...state,
        currentUser: null
    }))
);