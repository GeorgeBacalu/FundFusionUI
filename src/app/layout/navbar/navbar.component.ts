import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { userLoggedOutSuccessfully } from '../../shared/constants/constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, AvatarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  avatarUrl: string | undefined = undefined;
  menuItems: MenuItem[] = [{ label: 'View Profile', icon: 'pi pi-user', command: () => this.router.navigate(['/profile']) },
                           { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }];

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {}

  navigateToHome = () => this.router.navigate(['/']);

  logout = () => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedOutSuccessfully }), this.router.navigate(['/login']));                        
}
