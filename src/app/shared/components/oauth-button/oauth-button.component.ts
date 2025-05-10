import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../env/env.dev';
import { apiAuth } from '../../constants/constants';

@Component({
  selector: 'app-oauth-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './oauth-button.component.html',
  styleUrls: ['./oauth-button.component.scss'],
})
export class OauthButtonComponent {
  @Input() provider: 'Google' | 'Microsoft' | 'Twitter' = 'Google';

  get logo(): string { return { Google: 'assets/images/google.jpeg', Microsoft: 'assets/images/microsoft.jpeg', Twitter: 'assets/images/twitter.jpeg' }[this.provider]; }

  onClick = () => window.location.href = `${environment.baseUrl}/${apiAuth}/oauth/${this.provider.toLowerCase()}`;
}