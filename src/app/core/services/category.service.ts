import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiCategory } from '../../shared/constants/constants';
import { Category } from '../../shared/interfaces/category/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTree = (isIncome: boolean, deleted: boolean = false): Observable<Category[]> => this.http.get<Category[]>(`${this.baseUrl}/${apiCategory}/tree?isIncome=${isIncome}&deleted=${deleted}`);

  add = (request: FormData): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiCategory}`, request);

  edit = (request: FormData, id: string): Observable<{ message: string }> => this.http.put<{ message: string }>(`${this.baseUrl}/${apiCategory}/${id}`, request);

  softDelete = (id: string): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiCategory}/soft/${id}`);

  restore = (id: string): Observable<{ message: string }> => this.http.put<{ message: string }>(`${this.baseUrl}/${apiCategory}/restore/${id}`, null);

  hardDelete = (id: string): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiCategory}/hard/${id}`);

  reset = (): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiCategory}/reset`);
}
