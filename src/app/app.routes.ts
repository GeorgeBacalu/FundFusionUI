import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', redirectTo: '/register', pathMatch: 'full' }
];