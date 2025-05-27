import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { accountDeactivationFailed, userLoggedOutSuccessfully } from '../../shared/constants/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, Button, ConfirmDialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private authService: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {}

  confirmDeactivation = () => this.confirmationService.confirm({ header: 'Confirm Deactivation', message: 'This action will deactivate your account. You can reactivate it later by contacting support.',
    icon: 'pi pi-exclamation-triangle', acceptLabel: 'Yes', rejectLabel: 'Cancel', acceptButtonStyleClass: 'p-button-danger', accept: () => this.deactivateAccount() });

  deactivateAccount = () => this.authService.deactivateAccount().subscribe({
    next: ({ message }) => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: message }), this.router.navigate(['/login'])),
    error: ({ error }) => this.messageService.add({ severity: 'error', summary: error?.title || 'Error', detail: error?.detail || accountDeactivationFailed })
  });

  navigateToChangePassword = () => this.router.navigate(['/change-password']);

  logout = () => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedOutSuccessfully }), this.router.navigate(['/login']));
}
