import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { userLoggedOutSuccessfully } from '../../shared/constants/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, Button],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private messageService: MessageService, private router: Router) {}

  logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedOutSuccessfully });
    this.router.navigate(['/login']);
  }
}