import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { TweetService } from '../services/tweet/tweet.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  private router = inject(Router)

  form: FormGroup;

  authService = inject(AuthService);


  constructor() {

    this.form = new FormGroup({
      fullname: new FormControl(),
      username: new FormControl(),
      biography: new FormControl(),

    })
  }

  httpClient = inject(HttpClient);
  tweetService = inject(TweetService);

  ngOnInit() {

    this.authService.user.subscribe(response => {

      if (response.id) {
        this.form.setValue({
          fullname: response?.fullname,
          username: response?.username,
          biography: response?.biography || ""
        })
      }

    })


  }
  getUser() {
    const url = `${environment.apiUrl}/users`;

    this.httpClient.get<any>(url).subscribe(async (response: any) => {

      this.form.setValue({
        username: response.username,
        fullname: response.fullname,
        biography: response?.biography
      })
    })

  }

  updateUser() {

    const url = `${environment.apiUrl}/users`;

    this.httpClient.put<any>(url, this.form.value).subscribe(async (response: any) => {

      console.log(response);

      this.getUser();
      this.authService.getUsers();
      this.tweetService.getTweet();
    })

    this.router.navigate(['/']);

  }
}
