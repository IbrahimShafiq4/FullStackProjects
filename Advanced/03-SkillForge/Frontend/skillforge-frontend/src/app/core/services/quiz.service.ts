import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export interface IQuiz {
    id: number;
    title: string;
    durationMinutes: number;
    questionsCount: number;
}

export interface IOption {
    id: number;
    text: string;
}

export interface IQuestion {
    id: number;
    text: string;
    type: string;
    durationMinutes: number;
    points: number;
    options: IOption[];
}

export interface IQuizWithQuestions {
    id: number;
    title: string;
    durationMinutes: number;
    questions: IQuestion[];
}

export interface IAttemptResult {
    attemptId: number;
    score: number;
    status: string;
    averageScore: number;
    percentileRank: number;
}

export interface IQuestionDifficulty {
    questionText: string;
    correctRate: number;
}

export interface IQuizAnalytics {
    totalAttempts: number;
    averageScore: number;
    standardDeviation: number;
    questionsDifficulty: IQuestionDifficulty[];
}

@Service()
export class QuizService {
    private _HttpClient: HttpClient = inject(HttpClient);
    private readonly BASE: string = "https://localhost:7217/api";

    quizzes: WritableSignal<IQuiz[]> = signal<IQuiz[]>([]);
    availableQuizzes: WritableSignal<IQuiz[]> = signal<IQuiz[]>([]);
    currentQuiz: WritableSignal<IQuizWithQuestions | null> = signal<IQuizWithQuestions | null>(null);
    analytics: WritableSignal<IQuizAnalytics | null> = signal<IQuizAnalytics | null>(null);

    loadCompanyQuizzes(companyId: number): void {
        this._HttpClient.get<IQuiz[]>(`${this.BASE}/quizzes/company/${companyId}`).subscribe({
            next: (quizzes) => this.quizzes.set(quizzes),
        });
    }

    loadAvailableQuizzes(): void {
        this._HttpClient.get<IQuiz[]>(`${this.BASE}/quizzes/available`).subscribe({
            next: (quizzes) => this.availableQuizzes.set(quizzes),
        });
    }

    createQuiz(companyId: number, title: string, durationMinutes: number): Observable<{ id: number }> {
        return this._HttpClient.post<{ id: number }>(`${this.BASE}/quizzes`, { companyId, title, durationMinutes });
    }

    deleteQuiz(id: number, companyId: number): Observable<any> {
        return this._HttpClient.delete<any>(`${this.BASE}/quizzes/${id}/company/${companyId}`);
    }

    addQuestion(quizId: number, question: any): Observable<any> {
        return this._HttpClient.post<any>(`${this.BASE}/questions/quiz/${quizId}`, question);
    }

    deleteQuestion(questionId: number): Observable<any> {
        return this._HttpClient.delete<any>(`${this.BASE}/questions/${questionId}`);
    }

    loadQuizWithQuestions(quizId: number): void {
        this._HttpClient.get<IQuizWithQuestions>(`${this.BASE}/quizzes/${quizId}/for-candidate`).subscribe({
            next: (quiz) => this.currentQuiz.set(quiz),
        });
    }

    loadQuizForCandidate(quizId: number): void {
        this._HttpClient.get<IQuizWithQuestions>(`${this.BASE}/quizzes/${quizId}/for-candidate`).subscribe({
            next: (quiz) => this.currentQuiz.set(quiz),
        });
    }

    startAttempt(quizId: number): Observable<{ attemptId: number; startedAt: string; mustSubmitBy: string }> {
        return this._HttpClient.post<{ attemptId: number; startedAt: string; mustSubmitBy: string }>(
            `${this.BASE}/attempts/start?quizId=${quizId}`,
            {}
        );
    }

    submitAttempt(attemptId: number, answers: any[]): Observable<IAttemptResult> {
        return this._HttpClient.post<IAttemptResult>(`${this.BASE}/attempts/${attemptId}/submit`, { answers });
    }

    loadAnalytics(quizId: number): void {
        this._HttpClient.get<IQuizAnalytics>(`${this.BASE}/analytics/quiz/${quizId}`).subscribe({
            next: (analytics) => this.analytics.set(analytics),
        });
    }
}