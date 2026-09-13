import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Toast } from '../../core/services/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private _Auth = inject(Auth);
  private _Toast = inject(Toast);
  user = this._Auth.currentUser;

  ngOnInit() {
  }

  logout(): void {
    this._Auth.logout();
  }
}