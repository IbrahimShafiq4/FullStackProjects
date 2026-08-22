import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto, RegisterDto } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = 'https://localhost:7072/api/auth';

    constructor(private http: HttpClient) { }

    register(dto: RegisterDto): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/register`, dto, { withCredentials: true });
    }

    login(dto: LoginDto): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/login`, dto, { withCredentials: true });
    }
}