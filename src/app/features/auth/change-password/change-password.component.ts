import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { changePasswordValidator } from '../../../shared/validators/change-password.validator';
import { passwordChangeFailed, passwordRegex } from '../../../shared/constants/constants';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NgIf, RouterModule, ReactiveFormsModule, ButtonModule, CardModule, PasswordModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      confirmedPassword: ['', Validators.required]
    }, { validators: changePasswordValidator });
  }

  get currentPassword() { return this.changePasswordForm.controls['currentPassword']; }
  get newPassword() { return this.changePasswordForm.controls['newPassword']; }
  get confirmedPassword() { return this.changePasswordForm.controls['confirmedPassword']; }

  changePassword = () => this.authService.changePassword(this.changePasswordForm.value).subscribe({
    next: ({ message }) => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Check your input', detail: error?.detail || passwordChangeFailed })
  });
}
