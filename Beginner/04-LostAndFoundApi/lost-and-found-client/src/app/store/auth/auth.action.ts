import { createAction, props } from '@ngrx/store';
import { UserDto } from '../../../models/user.model';

export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
    '[Auth] Load Current User Success',
    props<{ user: UserDto }>()
);

export const loadCurrentUserFailure = createAction(
    '[Auth] Load Current User Failure',
    props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');