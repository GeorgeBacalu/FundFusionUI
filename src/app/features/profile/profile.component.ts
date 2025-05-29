import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map, switchMap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectModule } from 'primeng/select';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { LocationService } from '../../core/services/location.service';
import { GetProfileDataResponse, UserDto, UserSettingsDto, Theme } from '../../shared/interfaces/user/profile.interface';
import { Country, State, City, Currency, Locale, CountryPhoneDataResponse } from '../../shared/interfaces/location/location.interface';
import { accountDeactivationFailed, countryNotFound, stateNotFound, profileLoadFailed, profileUpdateFailed } from '../../shared/constants/constants';
import { AsYouType, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, CardModule, AvatarModule, MenuModule, ButtonModule, DividerModule, InputTextModule, InputMaskModule, InputSwitchModule, SelectModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  editState = { name: false, email: false, phone: false, country: false, state: false, city: false, currency: false, language: false, theme: false, emailNotify: false, showLastLogin: false };

  profileForm!: FormGroup;
  profileData: GetProfileDataResponse = { user: {} as UserDto, userSettings: {} as UserSettingsDto };
  countryPhonesData: CountryPhoneDataResponse[] = [];
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  currencies: Currency[] = [];
  locales: Locale[] = [];
  themes = Object.values(Theme);
  themesMap: { [key: number]: Theme } = { 0: Theme.System, 1: Theme.Light, 2: Theme.Dark };
  mask: string = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService, private locationService: LocationService, private authService: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {
    this.profileForm = this.formBuilder.group({ name: '', email: '', phone: '', countryPhoneData: null, country: null, state: null, city: null, currency: null, language: null, theme: null, emailNotify: false, showLastLogin: false });
  }

  get name() { return this.profileForm.controls['name']; }
  get email() { return this.profileForm.controls['email']; }
  get phone() { return this.profileForm.controls['phone']; }
  get countryPhoneData() { return this.profileForm.controls['countryPhoneData']; }
  get country() { return this.profileForm.controls['country']; }
  get state() { return this.profileForm.controls['state']; }
  get city() { return this.profileForm.controls['city']; }
  get currency() { return this.profileForm.controls['currency']; }
  get language() { return this.profileForm.controls['language']; }
  get theme() { return this.profileForm.controls['theme']; }
  get emailNotify() { return this.profileForm.controls['emailNotify']; }
  get showLastLogin() { return this.profileForm.controls['showLastLogin']; }
  get isEditing(): boolean { return Object.values(this.editState).some(editing => editing); }
  
  get menuItems(): MenuItem[] {
    const hasAvatar = !!this.profileData?.userSettings?.avatarUrl;
    const items: MenuItem[] = [{ label: hasAvatar ? 'Change Image' : 'Upload', icon: hasAvatar ? 'pi pi-pencil' : 'pi pi-upload', command: () => this.fileInput.nativeElement.click() }];
    if (hasAvatar) items.push({ label: 'Remove Image', icon: 'pi pi-trash', command: () => {} });
    return items;
  }

  ngOnInit(): void {
    this.locationService.getCountryPhonesData().subscribe(countryPhonesData => this.countryPhonesData = countryPhonesData);
    this.userService.getProfileData().pipe(switchMap(({ user, userSettings }) => {
      this.profileData = { user, userSettings };
      return forkJoin({ countries: this.locationService.getCountries(), currencies: this.locationService.getCurrencies(), locales: this.locationService.getLocales() }).pipe(
        switchMap(({ countries, currencies, locales }) => {
          this.countries = countries;
          this.currencies = currencies;
          this.locales = locales;
          const selectedCountry = countries.find(country => country.name === user.country);
          
          if (!selectedCountry) throw new Error(countryNotFound);
          return forkJoin({ states: this.locationService.getStatesByCountryId(selectedCountry.id), selectedCountry: [selectedCountry] });
        }),
        switchMap(({ states, selectedCountry }) => {
          this.states = states;
          const selectedState = states.find(state => state.name === user.state);
          
          if (!selectedState) throw new Error(stateNotFound);
          return forkJoin({ cities: this.locationService.getCitiesByStateId(selectedState.id), selectedState: [selectedState], selectedCountry: [selectedCountry] });
        }),
        map(({ cities, selectedState, selectedCountry }) => {
          this.cities = cities;
          const selectedCity = cities.find(city => city.name === user.city);
          const selectedCurrency = this.currencies.find(currency => currency.code === userSettings.currency);
          const selectedLocale = this.locales.find(locale => locale.name === userSettings.language);
          
          this.profileForm.patchValue({ name: user.name, email: user.email, phone: user.phone, country: selectedCountry, state: selectedState, city: selectedCity,
            currency: selectedCurrency, language: selectedLocale, theme: this.themesMap[+userSettings.theme], emailNotify: userSettings.emailNotify, showLastLogin: userSettings.showLastLogin });
        }));
    })).subscribe({ error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: profileLoadFailed }) });
  }

  onAvatarChange = (event: any) => console.log('Avatar changed:', event);

  toggleEdit(field: keyof typeof this.editState): void {
    this.editState[field] = true;
    if (field === 'country') this.editState.state = this.editState.city = true;
    if (field === 'state') this.editState.city = true;
  }

  toggleEditPone(): void {
    this.toggleEdit('phone');
    if (!this.editState.phone || !this.phone.value) return;
    const country = this.countryPhonesData.find(country => this.phone.value.startsWith(country.prefix));
    if (!country) return;
    this.countryPhoneData.setValue(country);
    const { prefix, code, length } = this.countryPhoneData.value || {};
    const example = getExampleNumber(code, examples);
    this.mask = example ? `${prefix}${new AsYouType(code).input(example.number).replace(/\d/g, '9').slice(prefix.length)}` : `'${prefix}' ${'9'.repeat(length - prefix.length)}`; 
  }

  onCountryChange(): void {
    this.phone.reset();
    const { prefix, code, length } = this.countryPhoneData.value || {};
    if (!prefix || !code) return void (this.mask = '');
    const example = getExampleNumber(code, examples);
    this.mask = example ? `${prefix}${new AsYouType(code).input(example.number).replace(/\d/g, '9').slice(prefix.length)}` : `'${prefix}' ${'9'.repeat(length - prefix.length)}`;
  }

  loadStates(): void {
    if (!this.country) return;
    this.profileForm.patchValue({ state: null, city: null });
    this.states = []; this.cities = [];
    this.locationService.getStatesByCountryId(this.country.value.id).subscribe(states => this.states = states);
  }

  loadCities(): void {
    if (!this.state) return;
    this.profileForm.patchValue({ city: null });
    this.cities = [];
    this.locationService.getCitiesByStateId(this.state.value.id).subscribe(cities => this.cities = cities);
  }

  navigateToChangePassword = () => this.router.navigate(['/change-password']);

  confirmDeactivation = () => this.confirmationService.confirm({ header: 'Confirm Deactivation', message: 'This action will deactivate your account. You can reactivate it later by contacting support.',
    icon: 'pi pi-exclamation-triangle', acceptLabel: 'Yes', rejectLabel: 'Cancel', rejectButtonStyleClass: 'p-button-secondary', acceptButtonStyleClass: 'p-button-danger', accept: () => this.deactivateAccount() });

  deactivateAccount = () => this.authService.deactivateAccount().subscribe({
    next: ({ message }) => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || accountDeactivationFailed })
  });

  confirmCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-exclamation-triangle', acceptLabel: 'Yes', 
    rejectLabel: 'Cancel', rejectButtonStyleClass: 'p-button-secondary', accept: () => Object.keys(this.editState).forEach(key => this.editState[key as keyof typeof this.editState] = false) });

  updateProfile(): void {
    const { name, email, phone, country, state, city, currency, language, emailNotify, showLastLogin } = this.profileForm.value;
    this.userService.updateProfile({ name, email, phone, country: country?.name, state: state?.name, city: city?.name, currency: currency?.code, language: language?.name, theme: +Object.entries(this.themesMap).find(([, value]) => value === this.theme.value)![0], emailNotify, showLastLogin }).subscribe({
      next: ({ message }) => (Object.keys(this.editState).forEach(key => this.editState[key as keyof typeof this.editState] = false), this.messageService.add({ severity: 'success', summary: 'Success', detail: message })),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || profileUpdateFailed })
    });
  };
}
