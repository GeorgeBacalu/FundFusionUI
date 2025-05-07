import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { passwordRegex } from '../../../shared/constants/constants';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      confirmedPassword: ['', Validators.required],
      phone: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get name() { return this.registerForm.controls['name']; }
  get email() { return this.registerForm.controls['email']; }
  get password() { return this.registerForm.controls['password']; }
  get confirmedPassword() { return this.registerForm.controls['confirmedPassword']; }
  get phone() { return this.registerForm.controls['phone']; }

  register = () => this.authService.register(this.registerForm.value).subscribe({
    next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || 'Registration failed' })
  });
}