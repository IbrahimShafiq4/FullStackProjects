import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  selectCurrentUser,
  selectIsLoggedIn
} from '../../store/auth/auth.selectors';

import {
  loadCurrentUser,
  logout
} from '../../store/auth/auth.action';

import { UserDto } from '../../../models/user.model';
import { AppState } from '../../store/auth/app.state';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {

  private store = inject(Store<AppState>);

  currentUser$: Observable<UserDto | null> =
    this.store.select(selectCurrentUser);

  isLoggedIn$: Observable<boolean> =
    this.store.select(selectIsLoggedIn);

  ngOnInit(): void {
    this.store.dispatch(loadCurrentUser());
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}