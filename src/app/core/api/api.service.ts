import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../env/env.dev";

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  get = <T>(path: string, options: {}): Observable<T> => this.http.get<T>(`${this.baseUrl}${path}`, options);

  post = <T>(path: string, body: {}, options: {}): Observable<T> => this.http.post<T>(`${this.baseUrl}${path}`, body, options);

  put = <T>(path: string, body: {}, options: {}): Observable<T> => this.http.put<T>(`${this.baseUrl}${path}`, body, options);

  patch = <T>(path: string, body: {}, options: {}): Observable<T> => this.http.patch<T>(`${this.baseUrl}${path}`, body, options);

  delete = <T>(path: string, options: {}): Observable<T> => this.http.delete<T>(`${this.baseUrl}${path}`, options);
}
