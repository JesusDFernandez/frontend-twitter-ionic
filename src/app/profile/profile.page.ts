import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TweetService } from '../services/tweet/tweet.service';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);


  idProfile: string | undefined
  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  constructor() {

    this.activatedRoute.params.subscribe(params => {
      this.idProfile = params['id'];

      console.log(this.idProfile);
      this.authService.getUserId(this.idProfile);


    })

  }

  tweetService = inject(TweetService);

  infoUser: any
  user: any
  follows: any

  ngOnInit() {
    this.authService.userId.subscribe(response => {

      this.infoUser = response
      console.log(this.infoUser);
    })

    this.authService.user.subscribe(response => {
      console.log(response);
      this.user = response
      console.log(this.user);
    })



    this.getFollow();
  }

  isFollow(id: any) {


    for (let i = 0; i < this.follows?.length; i++) {
      const element = this.follows[i];
      if (element.following === id) {
        return true
      }
    }
    return false


  }

  getFollow() {

    const url = `${environment.apiUrl}/follows`;

    this.httpClient.get<any>(url).subscribe(async (response: any) => {

      console.log(response);
      this.follows = response;
    })

  }
  follow(id: any, follow: any) {
    console.log(id);
    console.log(follow);
    let isFollow = true;
    this.follows.map((element: any) => {
      console.log(element);

      if (element.following === id) {

        console.log("siguiendo");
        const url = `${environment.apiUrl}/follow/${element._id}`;

        this.httpClient.delete<any>(url).subscribe(async (response: any) => {

          console.log(response);
          this.tweetService.getTweet();
          this.getFollow();
        })
        isFollow = false;
        return

      }

    });

    console.log("seguir");
    console.log(isFollow);

    if (isFollow) {

      const url = `${environment.apiUrl}/follow`;

      this.httpClient.post<any>(url, { following: id }).subscribe(async (response: any) => {

        console.log(response);
        this.tweetService.getTweet();
        this.getFollow();

      })
    }


  }
}
