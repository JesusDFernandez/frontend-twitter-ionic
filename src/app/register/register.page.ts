import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TweetService } from '../services/tweet/tweet.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  form: FormGroup;

  authService = inject(AuthService);

  private router = inject(Router)
  private cookies = inject(CookieService);

  constructor() {

    this.form = new FormGroup({
      fullname: new FormControl(),
      username: new FormControl(),
      password: new FormControl(),
      passwordC: new FormControl(),
      biography: new FormControl(),

    })
  }



  typeInputPw = 'password';
  typeEye = "eye-off-outline";

  isOpen = false;
  isMessage = "";
  tweetService = inject(TweetService);




  ngOnInit() {
  }

  goToLogin() {
    this.router.navigate(['login']);
  }


  async onSubmit() {

    this.isOpen = false;

    const nullValues = Object.entries(this.form.value).filter(([key, value]) => value === null).map(([key, value]) => key);
    if (nullValues.length > 0) {

      setTimeout(() => {
        this.isOpen = true;
        this.isMessage = `Los siguientes campos estan vacios: ${nullValues.join(', ')}`

      }, 500);
      return;

    }

    const { password, passwordC } = this.form.value;

    if (!(password === passwordC)) {

      setTimeout(() => {
        this.isOpen = true;
        this.isMessage = "Las contraseñas no coinciden. Por favor, inténtalo de nuevo."
      }, 500);

      return
    }

    const response: any = await this.authService.register(this.form.value);

    response.subscribe(async (response: any) => {

      this.cookies.set("token", response.token);
      this.form.reset();

      this.tweetService.getTweet();
      this.authService.getUsers();
      this.authService.getUser();

      this.router.navigate(["/tabs"]);

    }, (err: any) => {

      console.log(err);

      this.isOpen = true;
      this.isMessage = err.error.message[0]

    });

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