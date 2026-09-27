import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IVideo } from '../models';
import { environment } from '../../src/environments';

@Service()
export class VideosService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/videos`;

    public uploadVideo(courseId: number, title: string, order: number, blob: Blob, fileName: string): Observable<{ id: number }> {
        const formData: FormData = new FormData();
        formData.append('title', title);
        formData.append('order', order.toString());
        formData.append('file', blob, fileName);

        return this._HttpClient.post<{ id: number }>(
            `${this._ApiUrl}/course/${courseId}`,
            formData,
            { withCredentials: true }
        );
    }

    public uploadVideoWithProgress(courseId: number, title: string, order: number, file: File): Observable<HttpEvent<{ id: number }>> {
        const formData: FormData = new FormData();
        formData.append('title', title);
        formData.append('order', order.toString());
        formData.append('file', file);

        const request = new HttpRequest<FormData>(
            'POST',
            `${this._ApiUrl}/course/${courseId}`,
            formData,
            { withCredentials: true, reportProgress: true }
        );

        return this._HttpClient.request<{ id: number }>(request);
    }

    public getCourseVideos(courseId: number): Observable<IVideo[]> {
        return this._HttpClient.get<IVideo[]>(`${this._ApiUrl}/course/${courseId}`, { withCredentials: true });
    }

    public getStreamUrl(videoId: number): string {
        return `${environment.apiUrl}/api/videos/${videoId}/stream`;
    }
}