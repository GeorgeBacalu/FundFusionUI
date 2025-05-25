import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { OauthButtonComponent } from '../../../shared/components/oauth-button/oauth-button.component';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { accountNotFound, genericError, invalidCredentials, userLoggedInSuccessfully } from '../../../shared/constants/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule, DividerModule, OauthButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
    this.loginForm = this.formBuilder.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  }

  get email() { return this.loginForm.controls['email']; }
  get password() { return this.loginForm.controls['password']; }

  login = () => this.authService.login(this.loginForm.value).subscribe({
    next: ({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedInSuccessfully });
      this.router.navigate(['/']);
    },
    error: ({ status }: { status: number }) => this.messageService.add({ severity: 'error', summary: 'Login failed', detail: { 404: accountNotFound, 400: invalidCredentials }[status] ?? genericError })
  })
}
