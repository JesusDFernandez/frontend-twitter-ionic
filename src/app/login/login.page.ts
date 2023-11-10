import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TweetService } from '../services/tweet/tweet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  form: FormGroup;

  authService = inject(AuthService);

  private router = inject(Router)
  private cookies = inject(CookieService);

  constructor() {

    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    })

  }


  typeInputPw = 'password';
  typeEye = "eye-off-outline";

  isOpen = false;
  isMessage = "";
  tweetService = inject(TweetService);


  async onSubmit() {
    this.isOpen = false;


    const response: any = await this.authService.login(this.form.value)

    response.subscribe(async (response: any) => {
      console.log(response);
      this.cookies.set("token", response.token)
      this.form.reset();


      this.tweetService.getTweet();
      this.authService.getUsers();
      this.authService.getUser();



      this.router.navigate(["/tabs"]);


    }, (err: { error: { message: any; }; }) => {

      this.isOpen = true;
      this.isMessage = err.error.message[0]

    });

  }

  onRegister() {
    this.router.navigate(['register']);
  }

  goToHome() {
    this.router.navigate(['tabs']);
  }

  showHidePw(event: any) {

    if (this.typeInputPw === "text") {
      this.typeEye = "eye-off-outline";
      this.typeInputPw = "password";
    } else {
      this.typeEye = "eye-outline";
      this.typeInputPw = "text";
    }

  }
}
