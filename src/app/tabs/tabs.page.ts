import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  private cookies = inject(CookieService);
  authService = inject(AuthService);

  constructor(private router: Router) { }

  gotoBack() {
    this.authService.logout()

  }
}
