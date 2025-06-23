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

  getTreeByType = (isIncome: boolean): Observable<Category[]> => this.http.get<Category[]>(`${this.baseUrl}/${apiCategory}/tree?isIncome=${isIncome}`);

  add = (payload: FormData): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiCategory}`, payload);

  edit = (payload: FormData, id: string): Observable<{ message: string }> => this.http.put<{ message: string }>(`${this.baseUrl}/${apiCategory}/${id}`, payload);

  delete = (id: string): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiCategory}/${id}`);
}
