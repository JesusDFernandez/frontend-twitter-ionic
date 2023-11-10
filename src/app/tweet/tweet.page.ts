import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { TweetService } from '../services/tweet/tweet.service';
import { AuthService } from '../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'page-app-tweet',
  templateUrl: './tweet.page.html',
  styleUrls: ['./tweet.page.scss'],
})
export class TweetPage implements OnInit {

  idTweet: any = false

  private activatedRoute = inject(ActivatedRoute)
  httpClient = inject(HttpClient);
  isModalOpen = false;

  private router = inject(Router);

  form: FormGroup;

  tweetService = inject(TweetService);


  comments = signal<any>([]);
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.form.reset();
      this.idEdit = "";

    }
  }


  constructor() {
    this.form = new FormGroup({
      text: new FormControl(),

    })

    this.activatedRoute.params.subscribe(params => {
      this.idTweet = params['id'];
      this.getTweetComment();
    })


    this.tweetService.getTweetId();

  }

  authService = inject(AuthService);
  idUser: any;


  ngOnInit() {

    this.authService.user.subscribe(response => {

      this.idUser = response.id


    });

  }

  idEdit = "";
  async editComment(id: any) {

    const url = `${environment.apiUrl}/comment/${id}`;

    const response = await firstValueFrom(this.httpClient.get<any>(url))


    console.log(response);


    this.form.setValue({
      text: response[0]?.text
    })
    this.setOpen(true);
    console.log(id);
    this.idEdit = id;


  }


  deleteComment(id: any) {

    const url = `${environment.apiUrl}/comments/${id}`;

    this.httpClient.delete<any>(url).subscribe(async (response: any) => {

      this.getTweetComment();

    })

  }


  isAlertOpen = false;

  idComment = "";
  setOpenAlert(isOpen: boolean) {

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
      text: 'Eliminar', role: 'confirm',
      cssClass: 'alert-button-confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev: any) {
    if (ev.detail.role === "confirm") {
      console.log("borrando");
      console.log(this.idComment);
      this.deleteComment(this.idComment);

    }

    this.setOpenAlert(false);
  }


  setPreviewOpen(id: any, isOpen: boolean) {
    this.idComment = id;
    this.setOpenAlert(isOpen);

  }


  getTweetComment() {

    const url = `${environment.apiUrl}/comments/${this.idTweet}`;

    this.httpClient.get<any>(url).subscribe(async (response: any) => {

      console.log(response);

      this.comments.set(response.comment);
      this.countLike = response.likeTweet;
      this.likes = response.like;

    })



  }

  createCommet(id_tweet: any) {

    if (this.idEdit) {

      console.log("editar");

      const url = `${environment.apiUrl}/comments/${this.idEdit}`;

      this.httpClient.put<any>(url, this.form.value).subscribe(async (response: any) => {

        console.log(response);

        this.getTweetComment();

        this.tweetService.getTweet();

        this.tweetService.getTweetId();
        this.setOpen(false);
      })


    } else {

      const url = `${environment.apiUrl}/comments/`;

      this.httpClient.post<any>(url, { ...this.form.value, id_tweet }).subscribe(async (response: any) => {

        console.log(response);

        this.getTweetComment();

        this.tweetService.getTweet();

        this.tweetService.getTweetId()

        this.setOpen(false);
      })

    }

  }



  getTime(fecha: string) {


    const DATE_UNITS = { day: 86400, hour: 3600, minute: 60, second: 1 }
    const getSecondsDiff = (timestamp: any) => (Date.now() - timestamp) / 1000
    const getUnitAndValueDate = (secondsElapsed: any) => {
      for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
        if (secondsElapsed >= secondsInUnit || unit === "second") {
          const value = Math.floor(secondsElapsed / secondsInUnit) * -1
          return { value, unit }
        }
      }
      return
    }

    const getTimeAgo = (timestamp: any) => {
      const secondsElapsed = getSecondsDiff(timestamp);
      const obj: any = getUnitAndValueDate(secondsElapsed);


      if (obj.unit === "day" && obj.value < -1) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }

      const rtf = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" });

      return rtf.format(-Math.abs(obj.value), obj.unit);

    };

    const timestamp = Date.parse(fecha);


    return getTimeAgo(timestamp);

  }


  goBack() {

    this.router.navigateByUrl('/', { skipLocationChange: true });
  }


  likes: any;
  countLike: any

  getCountLike(id: any) {
    let cantidad = 0;

    for (let i = 0; i < this.countLike.length; i++) {
      const like = this.countLike[i];
      if (like.id === id) {
        cantidad++;
      }
    }
    return cantidad;
  }

  like(id: any) {

    for (let i = 0; i < this.likes.length; i++) {

      if (this.likes[i]?.id === id) {

        return [this.likes[i]?.like, this.likes[i]._id];

      }

    }

    return false;

  }


  onLike(id: any, like: any) {

    const url = `${environment.apiUrl}/likes`;



    for (let i = 0; i < this.likes.length; i++) {

      if (this.likes[i]?.id === id) {

        console.log("update");

        const url = `${environment.apiUrl}/likes/${like[1]}`;
        this.httpClient.put<any>(url, { id, isTweet: !this.likes[i].like }).subscribe(async (response: any) => {

          this.getTweetComment();

        })
        return
      }

    }



    console.log("create");


    this.httpClient.post<any>(url, { id, isTweet: true }).subscribe(async (response: any) => {

      this.getTweetComment();

    })

  }

}
