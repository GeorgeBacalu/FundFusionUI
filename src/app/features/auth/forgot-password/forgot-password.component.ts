import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { genericError } from '../../../shared/constants/constants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService) {
    this.forgotPasswordForm = this.formBuilder.group({ email: ['', [Validators.required, Validators.email]] });
  }

  get email() { return this.forgotPasswordForm.controls['email']; }

  sendResetLink = () => this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
    next: ({ message }) => this.messageService.add({ severity: 'success', summary: 'Success', detail: message }),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || genericError })
  });
}