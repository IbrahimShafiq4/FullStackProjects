import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateStudyFile, IMessageResponse, IStudyFile } from '../models';
import { environment } from '../../src/environments';

@Service()
export class StudyFilesService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/studyfiles`;

    public upload(dto: ICreateStudyFile, file: File): Observable<{ id: number }> {
        const formData: FormData = new FormData();
        formData.append('title', dto.title);
        formData.append('description', dto.description);
        formData.append('price', dto.price.toString());
        formData.append('isFree', dto.isFree.toString());
        formData.append('courseId', dto.courseId.toString());
        formData.append('file', file);

        return this._HttpClient.post<{ id: number }>(this._ApiUrl, formData, { withCredentials: true });
    }

    public getFilesByCourse(courseId: number): Observable<IStudyFile[]> {
        return this._HttpClient.get<IStudyFile[]>(`${this._ApiUrl}/course/${courseId}`, { withCredentials: true });
    }

    public download(fileId: number): Observable<Blob> {
        return this._HttpClient.get(`${this._ApiUrl}/${fileId}/download`, {
            responseType: 'blob',
            withCredentials: true
        });
    }

    public delete(fileId: number): Observable<IMessageResponse> {
        return this._HttpClient.delete<IMessageResponse>(`${this._ApiUrl}/${fileId}`, { withCredentials: true });
    }
}