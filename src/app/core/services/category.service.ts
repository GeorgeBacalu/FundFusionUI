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
}
