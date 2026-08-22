import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {
    Actions,
    createEffect,
    ofType
} from '@ngrx/effects';

import {
    catchError,
    map,
    of,
    switchMap,
    tap
} from 'rxjs';

import { UserDto } from '../../../models/user.model';
import * as AuthActions from './auth.action';

@Injectable()
export class AuthEffects {

    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private router = inject(Router);

    // ==========================================
    // Load Current User
    // ==========================================

    loadCurrentUser$ = createEffect(() =>
        this.actions$.pipe(

            ofType(AuthActions.loadCurrentUser),

            switchMap(() =>
                this.http
                    .get<UserDto>(
                        'https://localhost:7072/api/users/me',
                        {
                            withCredentials: true
                        }
                    )
                    .pipe(

                        map(user =>
                            AuthActions.loadCurrentUserSuccess({ user })
                        ),

                        catchError(error =>
                            of(
                                AuthActions.loadCurrentUserFailure({
                                    error: error.message
                                })
                            )
                        )

                    )
            )

        )
    );


    // ==========================================
    // Logout
    // ==========================================

    logout$ = createEffect(() =>
        this.actions$.pipe(

            ofType(AuthActions.logout),

            switchMap(() =>
                this.http
                    .post(
                        'https://localhost:7072/api/auth/logout',
                        {},
                        {
                            withCredentials: true
                        }
                    )
                    .pipe(

                        map(() =>
                            AuthActions.logoutSuccess()
                        ),

                        catchError(() =>
                            of(
                                AuthActions.logoutSuccess()
                            )
                        )

                    )
            )

        )
    );


    // ==========================================
    // Redirect After Logout
    // ==========================================

    redirectAfterLogout$ = createEffect(
        () =>
            this.actions$.pipe(

                ofType(AuthActions.logoutSuccess),

                tap(() =>
                    this.router.navigate(['/login'])
                )

            ),
        {
            dispatch: false
        }
    );
}