import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { userLoggedInSuccessfully } from '../../constants/constants';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.scss']
})
export class OauthCallbackComponent {
  constructor(private messageService: MessageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    const refreshToken = this.route.snapshot.queryParamMap.get('refresh_token');
    if (!accessToken || !refreshToken) {
      this.messageService.add({ severity: 'error', summary: 'Authentication Failed', detail: 'Something went wrong during login. Please try again or choose a different login option' });
      this.router.navigate(['/login']);
      return;
    }
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: userLoggedInSuccessfully });
    this.router.navigate(['/']);
  }
}
