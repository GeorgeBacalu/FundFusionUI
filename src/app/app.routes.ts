import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { OauthCallbackComponent } from './shared/components/oauth-callback/oauth-callback.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [guestGuard] },
    { path: 'oauth/callback', component: OauthCallbackComponent, canActivate: [guestGuard] },
    { path: '', component: HomeComponent, canActivate: [authGuard] }
];
