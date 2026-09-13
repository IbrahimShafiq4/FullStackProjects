import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IPropertyImage {
    id: number;
    url: string;
    isCover: boolean;
}

export interface IProperty {
    id: number;
    title: string;
    description: string;
    price: number;
    listingType: string;
    tourVideoUrl: string | null;
    ownerName: string;
    images: IPropertyImage[];
}

@Injectable({
    providedIn: 'root'
})
export class PropertiesService {
    private _HttpClient     : HttpClient = inject(HttpClient);

    private readonly API_URL: string     = 'https://localhost:7123/api/properties';
    readonly SERVER_ROOT    : string     = 'https://localhost:7123';

    properties: WritableSignal<IProperty[]> = signal<IProperty[]>([]);

    loadProperties() {
        this._HttpClient.get<IProperty[]>(this.API_URL).subscribe({
            next: (data) => this.properties.set(data)
        });
    }

    scheduleViewing(propertyId: number, scheduledAt: string) {
        return this._HttpClient.post<{ message: string, viewingId: number }>(
            `https://localhost:7123/api/viewings/property/${propertyId}`,
            { scheduledAt }
        );
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.SERVER_ROOT}/${relativeUrl}`;
    }

    createProperty(data: { title: string; description: string; price: number; listingType: string }) {
        return this._HttpClient.post<{ id: number }>(this.API_URL, data);
    }

    uploadImages(propertyId: number, files: File[]) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return this._HttpClient.post(`${this.API_URL}/${propertyId}/images`, formData);
    }

    uploadTourVideo(propertyId: number, video: File) {
        const formData = new FormData();
        formData.append('video', video);
        return this._HttpClient.post(`${this.API_URL}/${propertyId}/tour-video`, formData);
    }
}