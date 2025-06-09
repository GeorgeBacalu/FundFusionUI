import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { Category } from '../../shared/interfaces/category/category.interface';
import { apiCategory } from '../../shared/constants/constants';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getParents = (isIncome: boolean): Observable<Category[]> => this.http.get<Category[]>(`${this.baseUrl}/${apiCategory}?isIncome=${isIncome}`); 
}
