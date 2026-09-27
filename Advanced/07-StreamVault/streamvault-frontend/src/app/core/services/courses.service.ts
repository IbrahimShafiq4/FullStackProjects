import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse, ICreateCourse, IMessageResponse } from '../models';
import { environment } from '../../src/environments';

@Service()
export class CoursesService {
    private readonly _HttpClient: HttpClient = inject(HttpClient);
    private readonly _ApiUrl: string = `${environment.apiUrl}/api/courses`;

    public getCourses(): Observable<ICourse[]> {
        return this._HttpClient.get<ICourse[]>(this._ApiUrl, { withCredentials: true });
    }

    public getCourse(courseId: number): Observable<ICourse> {
        return this._HttpClient.get<ICourse>(`${this._ApiUrl}/${courseId}`, { withCredentials: true });
    }

    public getCoursesByFloor(floorId: number): Observable<ICourse[]> {
        return this._HttpClient.get<ICourse[]>(`${this._ApiUrl}/floor/${floorId}`, { withCredentials: true });
    }

    public createCourse(dto: ICreateCourse): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(this._ApiUrl, dto, { withCredentials: true });
    }

    public updateCourse(courseId: number, dto: ICreateCourse): Observable<IMessageResponse> {
        return this._HttpClient.put<IMessageResponse>(`${this._ApiUrl}/${courseId}`, dto, { withCredentials: true });
    }

    public deleteCourse(courseId: number): Observable<IMessageResponse> {
        return this._HttpClient.delete<IMessageResponse>(`${this._ApiUrl}/${courseId}`, { withCredentials: true });
    }
}