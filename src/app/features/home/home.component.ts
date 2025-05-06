import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { userLoggedOutSuccessfully } from '../../shared/constants/constants';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, Button],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {}

  logout = () => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedOutSuccessfully }), this.router.navigate(['/login']));

  navigateToChangePassword = () => this.router.navigate(['/change-password']);
}