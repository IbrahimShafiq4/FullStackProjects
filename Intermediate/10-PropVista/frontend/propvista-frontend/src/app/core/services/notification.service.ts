import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class NotificationService {
    private http = inject(HttpClient);

    private readonly apiUrl = 'https://localhost:7123/api/Notifications';

    requestVideoCall(viewingId: number) {
        return this.http.post(
            `${this.apiUrl}/request-video-call/${viewingId}`,
            {},
            {
                withCredentials: true
            }
        );
    }
}
