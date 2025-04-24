import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../env/env.dev";

@Injectable({ providedIn: "root" })
export class ApiService {
    private readonly baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) {}

    get<T>(path: string, options: {}): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${path}`, options);
    }

    post<T>(path: string, body: {}, options: {}): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${path}`, body, options);
    }

    put<T>(path: string, body: {}, options: {}): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${path}`, body, options);
    }

    patch<T>(path: string, body: {}, options: {}): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}${path}`, body, options);
    }

    delete<T>(path: string, options: {}): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${path}`, options);
    }
}