import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { userLoggedOutSuccessfully } from '../../shared/constants/constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule, AvatarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  avatarUrl$!: Observable<string | null>;
  avatarLoading$!: Observable<boolean>;
  menuItems: MenuItem[] = [{ label: 'View Profile', icon: 'pi pi-user', command: () => this.router.navigate(['/profile']) }, { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }];

  constructor(private authService: AuthService, private userService: UserService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void { this.userService.getAvatarUrl().subscribe(_ => (this.avatarUrl$ = this.userService.avatarUrl$, this.avatarLoading$ = this.userService.avatarLoading$)); }

  navigateToHome = () => this.router.navigate(['/']);
  onLoadStart = () => this.userService.setAvatarLoading(true);
  onLoadOrError = () => this.userService.setAvatarLoading(false);

  logout = () => (this.authService.logout(), this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedOutSuccessfully }), this.router.navigate(['/login']));                        
}
