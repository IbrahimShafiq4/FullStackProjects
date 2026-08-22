import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState =
    createFeatureSelector<AuthState>('auth');

export const selectCurrentUser =
    createSelector(
        selectAuthState,
        state => state.currentUser
    );

export const selectIsAuthLoading =
    createSelector(
        selectAuthState,
        state => state.isLoading
    );

export const selectIsLoggedIn =
    createSelector(
        selectCurrentUser,
        user => user !== null
    );