import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { Country, State, City, Currency, Locale, CountryPhoneInfoResponse } from '../../shared/interfaces/location/location.interface';
import { apiLocation } from '../../shared/constants/constants';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCountries = (): Observable<Country[]> => this.http.get<Country[]>(`${this.baseUrl}/${apiLocation}/countries`);

  getStatesByCountryId = (countryId: string): Observable<State[]> => this.http.get<State[]>(`${this.baseUrl}/${apiLocation}/states/${countryId}`);

  getCitiesByStateId = (stateId: string): Observable<City[]> => this.http.get<City[]>(`${this.baseUrl}/${apiLocation}/cities/${stateId}`);

  getCurrencies = (): Observable<Currency[]> => this.http.get<Currency[]>(`${this.baseUrl}/${apiLocation}/currencies`);

  getLocales = (): Observable<Locale[]> => this.http.get<Locale[]>(`${this.baseUrl}/${apiLocation}/locales`);

  getCountryPhonesInfo = (): Observable<CountryPhoneInfoResponse[]> => this.http.get<CountryPhoneInfoResponse[]>(`${this.baseUrl}/${apiLocation}/countries/phones-info`);
}
