import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { resetPasswordMatchValidator } from '../../../shared/validators/reset-password-match.validator';
import { invalidResetLink, passwordRegex, passwordResetFailed, resetLinkExpiredOrUsed } from '../../../shared/constants/constants';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, ButtonModule, CardModule, PasswordModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router, private route: ActivatedRoute) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      confirmedPassword: ['', Validators.required]
    }, { validators: resetPasswordMatchValidator });
  }

  get newPassword() { return this.resetPasswordForm.controls['newPassword']; }
  get confirmedPassword() { return this.resetPasswordForm.controls['confirmedPassword']; }

  resetPassword(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) return this.messageService.add({ severity: 'error', summary: 'Invalid link', detail: invalidResetLink });
    this.authService.resetPassword({ token, ...this.resetPasswordForm.value }).subscribe({
      next: ({ message }) => (this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
      error: ({ error }) => this.messageService.add({ severity: 'error', summary: 'Check your input', detail: error?.detail?.includes('used') ? resetLinkExpiredOrUsed : (error?.detail || passwordResetFailed) })
    });
  }
}
