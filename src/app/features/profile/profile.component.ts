import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { LocationService } from '../../core/services/location.service';
import { GetProfileInfoResponse, UserDto, UserSettingsDto, Theme } from '../../shared/interfaces/user/profile-info.interface';
import { Country, State, City, Currency, Locale } from '../../shared/interfaces/location/location.interface';
import { accountDeactivationFailed, profileLoadFailed } from '../../shared/constants/constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, CardModule, AvatarModule, MenuModule, ButtonModule, DividerModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm!: FormGroup;
  profileInfo: GetProfileInfoResponse = { user: {} as UserDto, userSettings: {} as UserSettingsDto };
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  currencies: Currency[] = [];
  locales: Locale[] = [];
  themes = Object.values(Theme);

  constructor(private formBuilder: FormBuilder, private userService: UserService, private locationService: LocationService, private authService: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {
    this.profileForm = this.formBuilder.group({ name: '', email: '', phone: '', country: null, state: null, city: null, currency: null, language: null, theme: null, emailNotify: false, showLastLogin: false });
  }

  get name() { return this.profileForm.controls['name']; }
  get email() { return this.profileForm.controls['email']; }
  get phone() { return this.profileForm.controls['phone']; }
  get country() { return this.profileForm.controls['country']; }
  get state() { return this.profileForm.controls['state']; }
  get city() { return this.profileForm.controls['city']; }
  get currency() { return this.profileForm.controls['currency']; }
  get language() { return this.profileForm.controls['language']; }
  get theme() { return this.profileForm.controls['theme']; }
  get emailNotify() { return this.profileForm.controls['emailNotify']; }
  get showLastLogin() { return this.profileForm.controls['showLastLogin']; }
  
  get menuItems(): MenuItem[] {
    const hasAvatar = !!this.profileInfo?.userSettings?.avatarUrl;
    const items: MenuItem[] = [{ label: hasAvatar ? 'Change Image' : 'Upload', icon: hasAvatar ? 'pi pi-pencil' : 'pi pi-upload', command: () => this.fileInput.nativeElement.click() }];
    if (hasAvatar) items.push({ label: 'Remove Image', icon: 'pi pi-trash', command: () => {} });
    return items;
  }

  ngOnInit(): void {
    this.userService.getProfileInfo().subscribe({
      next: ({ user, userSettings }) => {
        this.profileInfo = { user, userSettings };

        this.locationService.getCountries().subscribe((countries) => {
          this.countries = countries;
          const selectedCountry = countries.find(country => country.name === user.country)!;

          this.locationService.getStatesByCountryId(selectedCountry.id).subscribe(states => {
            this.states = states;
            const selectedState = states.find(state => state.name === user.state)!;

            this.locationService.getCitiesByStateId(selectedState.id).subscribe(cities => {
              this.cities = cities;
              const selectedCity = cities.find(city => city.name === user.city)!;

              this.locationService.getCurrencies().subscribe(currencies => {
                this.currencies = currencies;
                const selectedCurrency = currencies.find(currency => currency.code === userSettings.currency)!;

                this.locationService.getLocales().subscribe(locales => {
                  this.locales = locales;
                  const selectedLocale = locales.find(locale => locale.name === userSettings.language)!;

                  const themeMap: { [key: number]: Theme } = { 0: Theme.System, 1: Theme.Light, 2: Theme.Dark };
                  const selectedTheme = themeMap[userSettings.theme as unknown as number];

                  this.profileForm.patchValue({ name: user.name, email: user.email, phone: user.phone, country: selectedCountry, state: selectedState, city: selectedCity, 
                    currency: selectedCurrency, language: selectedLocale, theme: selectedTheme, emailNotify: userSettings.emailNotify, showLastLogin: userSettings.showLastLogin });
                });
              });
            });
          });
        });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: profileLoadFailed }),
    });
  }

  onAvatarChange = (event: any) => console.log('Avatar changed:', event);

  navigateToChangePassword = () => this.router.navigate(['/change-password']);

  confirmDeactivation = () => this.confirmationService.confirm({ header: 'Confirm Deactivation', message: 'This action will deactivate your account. You can reactivate it later by contacting support.',
    icon: 'pi pi-exclamation-triangle', acceptLabel: 'Yes', rejectLabel: 'Cancel', acceptButtonStyleClass: 'p-button-danger', accept: () => this.deactivateAccount() });

  deactivateAccount = () => this.authService.deactivateAccount().subscribe({
    next: ({ message }) => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || accountDeactivationFailed })
  });
}
