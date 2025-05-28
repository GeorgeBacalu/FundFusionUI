import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { OauthButtonComponent } from "../../../shared/components/oauth-button/oauth-button.component";
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { LocationService } from '../../../core/services/location.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { phoneValidator } from '../../../shared/validators/phone.validator';
import { Country, State, City, CountryPhoneDataResponse } from '../../../shared/interfaces/location/location.interface';
import { passwordRegex, registrationFailed } from '../../../shared/constants/constants';
import { AsYouType, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, InputMaskModule, PasswordModule, SelectModule, DividerModule, OauthButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  countryPhonesData: CountryPhoneDataResponse[] = [];
  mask: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private locationService: LocationService, private messageService: MessageService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      confirmedPassword: ['', Validators.required],
      phone: ['', [Validators.required]],
      countryPhoneData: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
    }, { validators: [passwordMatchValidator, phoneValidator] });
  }

  get name() { return this.registerForm.controls['name']; }
  get email() { return this.registerForm.controls['email']; }
  get password() { return this.registerForm.controls['password']; }
  get confirmedPassword() { return this.registerForm.controls['confirmedPassword']; }
  get phone() { return this.registerForm.controls['phone']; }
  get countryPhoneData() { return this.registerForm.controls['countryPhoneData']; }

  ngOnInit(): void {
    this.locationService.getCountries().subscribe(countries => this.countries = countries);
    this.locationService.getCountryPhonesData().subscribe(countryPhonesData => this.countryPhonesData = countryPhonesData);
  }

  loadStates(): void {
    const countryId = this.registerForm.value.country?.id;
    if (!countryId) return;

    this.registerForm.patchValue({ state: null, city: null });
    this.states = []; this.cities = [];
    this.locationService.getStatesByCountryId(countryId).subscribe(states => this.states = states);
  }

  loadCities(): void {
    const stateId = this.registerForm.value.state?.id;
    if (!stateId) return;

    this.registerForm.patchValue({ city: null });
    this.cities = [];
    this.locationService.getCitiesByStateId(stateId).subscribe(cities => this.cities = cities);
  }

  onCountryChange(): void {
    this.phone.reset();
    const { prefix, code, length } = this.countryPhoneData.value || {};
    if (!prefix || !code) return void (this.mask = '');

    const example = getExampleNumber(code, examples);
    this.mask = example ? `${prefix}${new AsYouType(code).input(example.number).replace(/\d/g, '9').slice(prefix.length)}` : `'${prefix}' ${'9'.repeat(length - prefix.length)}`;
  }

  register = (): void => {
    const { country, state, city, ...rest } = this.registerForm.value;
    this.authService.register({ ...rest, phone: this.phone.value, country: country.name, state: state.name, city: city.name }).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || registrationFailed })
    });
  }
}
