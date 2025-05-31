import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, switchMap } from 'rxjs';
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
import { phoneValidator } from '../../shared/validators/phone.validator';
import { GetProfileDataResponse, UserDto, UserSettingsDto, Theme } from '../../shared/interfaces/user/profile.interface';
import { Country, State, City, Currency, Locale, CountryPhoneDataResponse } from '../../shared/interfaces/location/location.interface';
import { accountDeactivationFailed, countryNotFound, stateNotFound, profileLoadFailed, profileUpdateFailed, avatarUploadFailed, genericError } from '../../shared/constants/constants';
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
  themeReverseMap: Record<Theme, number> = { [Theme.System]: 0, [Theme.Light]: 1, [Theme.Dark]: 2 };
  mask: string = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService, private locationService: LocationService, private authService: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      countryPhoneData: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      currency: [null, Validators.required],
      language: [null, Validators.required],
      theme: [null, Validators.required],
      emailNotify: [false],
      showLastLogin: [false]
    }, { validators: phoneValidator });
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
    return [{ label: hasAvatar ? 'Change Image' : 'Upload', icon: hasAvatar ? 'pi pi-pencil' : 'pi pi-upload', command: () => this.fileInput.nativeElement.click() }, ...(hasAvatar ? [{ label: 'Remove Image', icon: 'pi pi-trash', command: () => {}}] : [])];
  }

  ngOnInit(): void {
    this.locationService.getCountryPhonesData().subscribe(data => this.countryPhonesData = data);
    this.locationService.getCurrencies().subscribe(data => this.currencies = data);
    this.locationService.getLocales().subscribe(data => this.locales = data);
    this.userService.getProfileData().pipe(switchMap(({ user, userSettings }) => {
      this.profileData = { user, userSettings };
      return this.locationService.getCountries().pipe(map(countries => {
        this.countries = countries;
        const selectedCountry = countries.find(country => country.name === user.country);
        if (!selectedCountry) throw new Error(countryNotFound);
        return { user, userSettings, selectedCountry };
      }));
    }), switchMap(({ user, userSettings, selectedCountry }) => this.locationService.getStatesByCountryId(selectedCountry.id).pipe(map(states => {
        this.states = states;
        const selectedState = states.find(state => state.name === user.state);
        if (!selectedState) throw new Error(stateNotFound);
        return { user, userSettings, selectedCountry, selectedState };
    }))), switchMap(({ user, userSettings, selectedCountry, selectedState }) => this.locationService.getCitiesByStateId(selectedState.id).pipe(map(cities => {
        this.cities = cities;
        const selectedCity = cities.find(city => city.name === user.city);
        const selectedCurrency = this.currencies.find(currency => currency.code === userSettings.currency);
        const selectedLocale = this.locales.find(locale => locale.name === userSettings.language);

        this.profileForm.patchValue({ name: user.name, email: user.email, phone: user.phone, country: selectedCountry, state: selectedState, city: selectedCity, 
          currency: selectedCurrency, language: selectedLocale, theme: this.themesMap[+userSettings.theme], emailNotify: userSettings.emailNotify, showLastLogin: userSettings.showLastLogin });
    })))).subscribe({ error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: profileLoadFailed }) });
  }

  onAvatarChange = (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.userService.uploadAvatar(formData).subscribe({
      next: ({ message }) => {
        this.profileData.userSettings.avatarUrl = `${this.profileData.userSettings.avatarUrl?.split('?')[0]}?t=${Date.now()}`;
        this.resetEditState(); this.resetProfileData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
      },
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || avatarUploadFailed })
    });
  }

  toggleEdit(field: keyof typeof this.editState): void {
    this.editState[field] = true;
    if (field === 'country') this.editState.state = this.editState.city = true;
    if (field === 'state') this.editState.city = true;
  }

  toggleEditPhone(): void {
    this.toggleEdit('phone');
    if (!this.editState.phone || !this.phone.value) return;
    const country = this.countryPhonesData.find(country => this.phone.value.startsWith(country.prefix));
    if (!country) return;
    this.countryPhoneData.setValue(country);
    this.updateMask();
  }

  onCountryChange = () => (this.phone.reset(), this.updateMask());

  private updateMask(): void {
    const { prefix, code, length } = this.countryPhoneData.value || {};
    if (!prefix || !code) return void (this.mask = '');
    const example = getExampleNumber(code, examples);
    this.mask = example ? `${prefix}${new AsYouType(code).input(example.number).replace(/\d/g, '9').slice(prefix.length)}` : `${prefix}${'9'.repeat(length - prefix.length)}`;
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

  confirmDeactivation = () => this.confirmationService.confirm({ header: 'Confirm Deactivation', message: 'This action will deactivate your account. You can reactivate it later by contacting support.', icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes', rejectLabel: 'Cancel', acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => this.deactivateAccount() });

  deactivateAccount = () => this.authService.deactivateAccount().subscribe({
    next: ({ message }) => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || accountDeactivationFailed })
  });

  confirmCancel = () => this.confirmationService.confirm({ header: 'Confirm Cancel', message: 'Are you sure you want to cancel? All changes will be lost.', icon: 'pi pi-info-circle', acceptLabel: 'Yes', rejectLabel: 'Cancel',
    acceptIcon: "pi pi-check", rejectIcon: "pi pi-times", acceptButtonStyleClass: 'p-button-danger', rejectButtonStyleClass: 'p-button-secondary', accept: () => (this.resetEditState(), this.resetProfileData()) });

  updateProfile(): void {
    const { name, email, phone, country, state, city, currency, language, emailNotify, showLastLogin } = this.profileForm.value;
    this.userService.updateProfile({ name, email, phone, country: country?.name, state: state?.name, city: city?.name, currency: currency?.code, language: language?.name, theme: this.themeReverseMap[this.theme.value as Theme], emailNotify, showLastLogin }).subscribe({
      next: ({ message }) => (this.resetEditState(), this.messageService.add({ severity: 'success', summary: 'Success', detail: message })),
      error: ({ error }) => (this.resetEditState(), this.resetProfileData(), this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || profileUpdateFailed }))
    });
  }

  areEditedFieldsValid = (): boolean => Object.entries(this.editState).every(([field, isEditing]) => !isEditing || this.profileForm.get(field)?.valid);

  private resetEditState = () => Object.keys(this.editState).forEach(key => this.editState[key as keyof typeof this.editState] = false);

  private resetProfileData(): void {
    const { user, userSettings } = this.profileData;
    const selectedCountry = this.countries.find(country => country.name === user.country);
    const selectedCurrency = this.currencies.find(currency => currency.code === userSettings.currency);
    const selectedLocale = this.locales.find(locale => locale.name === userSettings.language);
    
    if (!selectedCountry) throw new Error(countryNotFound);
    this.locationService.getStatesByCountryId(selectedCountry.id).pipe(switchMap(states => {
      this.states = states;
      const selectedState = states.find(state => state.name === user.state);

      if (!selectedState) throw new Error(stateNotFound);
      return this.locationService.getCitiesByStateId(selectedState.id).pipe(map(cities => {
        this.cities = cities;
        const selectedCity = cities.find(city => city.name === user.city);

        this.profileForm.patchValue({ name: user.name, email: user.email, phone: user.phone, country: selectedCountry, state: selectedState, city: selectedCity, currency: selectedCurrency, language: selectedLocale, theme: this.themesMap[+userSettings.theme], emailNotify: userSettings.emailNotify, showLastLogin: userSettings.showLastLogin });
      }));
    })).subscribe({ error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: genericError }) });
  }
}
