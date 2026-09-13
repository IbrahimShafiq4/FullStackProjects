import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeToggle } from "./shared/components/theme-toggle/theme-toggle";
import { ToastContainer } from "./shared/components/toast-container/toast-container";
import * as signalR from '@microsoft/signalr';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle, ToastContainer, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  _AuthService = inject(AuthService);
  private _ToastService = inject(ToastService);
  private _Router = inject(Router);
  private notificationConnection: signalR.HubConnection | null = null;

  constructor() {
    effect(() => {
      const user = this._AuthService.currentUser();

      if (user) {
        console.log(
          '👤 User logged in, starting notification hub:',
          user.fullName
        );

        this.startNotificationConnection();
      } else {
        this.stopNotificationConnection();
      }
    });
  }

  private async startNotificationConnection() {
    if (
      this.notificationConnection?.state ===
      signalR.HubConnectionState.Connected
    ) {
      return;
    }

    if (this.notificationConnection) {
      await this.notificationConnection.stop();
    }

    this.notificationConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        'https://localhost:7123/hubs/notification',
        {
          withCredentials: true
        }
      )
      .withAutomaticReconnect()
      .build();

    this.notificationConnection.on(
      'VideoCallRequested',
      (viewingId: number, callerName: string) => {
        console.log('📞 Video call notification received!');
        console.log('Viewing ID:', viewingId);
        console.log('Caller:', callerName);

        this._ToastService.show(
          `📞 ${callerName} يطلب بدء معاينة فيديو`,
          'info',
          60000,
          {
            label: 'قبول',
            handler: () => {
              console.log(
                '✅ Owner accepted video call:',
                viewingId
              );

              this._Router.navigate([
                '/video-call',
                viewingId
              ]);
            }
          }
        );
      }
    );

    try {
      await this.notificationConnection.start();

      console.log(
        '🔔 Notification Hub connected:',
        this.notificationConnection.connectionId
      );
    } catch (error) {
      console.error(
        '❌ Notification Hub connection error:',
        error
      );
    }
  }

  private async stopNotificationConnection() {
    if (this.notificationConnection) {
      await this.notificationConnection.stop();
      this.notificationConnection = null;
    }
  }
}