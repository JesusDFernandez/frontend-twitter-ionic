import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private httpClient = inject(HttpClient);


  private cookies = inject(CookieService);
  private router = inject(Router);
  private _user;
  private _users;
  private _userId;

  constructor() {
    this._user = new BehaviorSubject<any>([]);
    this._users = new BehaviorSubject<any>([]);
    this._userId = new BehaviorSubject<any>([]);
  }

  get user() {
    this.getUser();
    return this._user.asObservable();
  }
  get users() {
    this.getUsers();
    return this._users.asObservable();
  }
  get userId() {
    return this._userId.asObservable();
  }


  async login(formValues: any) {
    const url = `${environment.apiUrl}/auth/login`;
    return this.httpClient.post(url, formValues);
  }

  async register(formValues: any) {
    const url = `${environment.apiUrl}/auth/register`;
    return this.httpClient.post(url, formValues);
  }


  logout() {

    this.cookies.delete("token");
    this.router.navigate(['login']);

  }

  async getUser() {
    const url = `${environment.apiUrl}/users`;

    this._user.next(await firstValueFrom(this.httpClient.get<any>(url)));
    return await firstValueFrom(this.httpClient.get<any>(url))
  }
  async getUsers() {
    const url = `${environment.apiUrl}/usersAll`;

    this._users.next(await firstValueFrom(this.httpClient.get<any>(url)));

  }
  async getUserId(id: any) {
    const url = `${environment.apiUrl}/user/${id}`;

    this._userId.next(await firstValueFrom(this.httpClient.get<any>(url)));

  }
}
