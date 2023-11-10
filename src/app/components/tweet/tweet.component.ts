
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TweetService } from '../../services/tweet/tweet.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
})

export class TweetComponent {

  httpClient = inject(HttpClient);

  tweetService = inject(TweetService);

  @Input() onlyUser = false
  @Input() idUser: any;
  @Input() tweetId: any = false;
  tweets = signal<any>([]);

  likes = <any>[];
  countComment = <any>[];
  countLike = <any>[];

  authService = inject(AuthService);


  private router = inject(Router)


  isAlertOpen = false;

  idTweet = "";
  setOpen(isOpen: boolean) {

    this.isAlertOpen = isOpen;
  }
  public alertButtons = [
    {

      text: 'Cancel', role: 'cancel',

      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'eliminar', role: 'confirm',
      cssClass: 'alert-button-confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev: any) {
    if (ev.detail.role === "confirm") {
      console.log("borrando");
      console.log(this.idTweet);

      this.deleteTweet(this.idTweet);
    }

    this.setOpen(false);
  }


  setPreviewOpen(id: any, isOpen: boolean) {
    this.idTweet = id;
    this.setOpen(isOpen);

  }

  constructor() { }


  idUserHtml: any

  ngOnInit() {

    this.authService.user.subscribe(response => {

      this.idUserHtml = response.id


    });
    console.log(this.idUser);

    console.log(this.onlyUser);


    if (this.onlyUser) {

      this.tweetService.getTweetsUser.subscribe(response => {
        console.log(response);

        this.tweets.set(response.Tweets)

        this.likes = [];
        this.countComment = [];
        this.countLike = [];
        this.likes.push(response.like)
        this.countComment.push(response.comment);
        this.countLike.push(response.likeTweet);
        this.ordenarMasNuevos(this.tweets());


      })
      this.tweetService.getTweetUser(this.idUser);


    } else {


      this.tweetService.getTweets.subscribe(response => {
        console.log(response);
        this.tweets.set(response.Tweets)
        this.likes = [];
        this.countComment = [];
        this.countLike = [];
        this.likes.push(response.like)
        this.countComment.push(response.comment);
        this.countLike.push(response.likeTweet);
        this.ordenarMasNuevos(this.tweets());
      })
    }

    if (this.tweetId) {

      this.tweetService.TweetId.subscribe((response: any) => {
        console.log(response);

        console.warn(this.tweetId);

        this.tweets.set(response.Tweets)
        this.likes = [];
        this.countComment = [];
        this.countLike = [];
        this.likes.push(response.like)
        this.countComment.push(response.comment);
        this.countLike.push(response.likeTweet);
        this.ordenarMasNuevos(this.tweets());

      })

      this.tweetService.getTweetId(this.tweetId);
    }


  }


  getCountCommnet(id: any) {

    return this.tweetService.getCountCommnet(this.countComment, id);

  }

  getCountLike(id: any) {

    return this.tweetService.getCountLike(this.countLike, id);

  }


  ordenarMasViejos(array: any[]): void {

    this.tweetService.ordenarMasViejos(this.tweets, array);

  }

  ordenarMasNuevos(array: any[]): void {

    this.tweetService.ordenarMasNuevos(this.tweets, array);

  }

  ordenarMasPopular(array: any[]): void {

    this.tweetService.ordenarMasPopular(this.countLike, this.tweets, array);

  }
  ordenarMenosPopular(array: any[]): void {

    this.tweetService.ordenarMenosPopular(this.countLike, this.tweets, array);

  }


  getTime(fecha: string) {

    const timestamp = Date.parse(fecha);

    return this.tweetService.getTimeAgo(timestamp);

  }

  goToTweetComment(id: any) {

    this.router.navigate(['tabs/tweet/' + id]);

  }


  like(id: any) {

    return this.tweetService.like(this.likes, id);

  }

  onLike(id: any, like: any) {

    console.log(id);
    console.log(like);
    console.log(this.likes);

    this.tweetService.onLike(this.likes, id, like);

  }


  editTweet(id: any) {

    console.log(id);
  }

  async deleteTweet(id: any) {
    console.log(id);

    await this.tweetService.deleteTweet(id);
    this.tweetService.getTweet();


  }
}
