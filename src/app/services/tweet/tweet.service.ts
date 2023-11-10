import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  httpClient = inject(HttpClient);



  private _tweets;
  private _tweetsUser;
  private _tweetsId;


  constructor() {
    this._tweets = new BehaviorSubject<any>([]);
    this._tweetsUser = new BehaviorSubject<any>([]);
    this._tweetsId = new BehaviorSubject<any>([]);
  }

  get TweetId() {

    return this._tweetsId.asObservable();
  }
  get getTweets() {
    this.getTweet();
    return this._tweets.asObservable();
  }
  get getTweetsUser() {
    this.getTweetUser()
    return this._tweetsUser.asObservable();

  }

  authService = inject(AuthService);

  idUser: any

  async createTweet(data: any) {

    const url = `${environment.apiUrl}/tweets`;



    this.httpClient.post<any>(url, data).subscribe(async (response: any) => {



      this.getTweet();


    })

  }

  async deleteTweet(id: any) {


    const url = `${environment.apiUrl}/tweets/${id}`;



    this.httpClient.delete<any>(url).subscribe(async (response: any) => {

      console.log(response);

      this.getTweet();


    })

  }



  tweetId: any;
  async getTweetId(id: any = this.tweetId) {
    this.tweetId = id;

    console.log(id);
    console.log(this.tweetId);
    if (id) {


      const url = `${environment.apiUrl}/tweet/${id}`;

      setTimeout(async () => {
        this._tweetsId.next(await firstValueFrom(this.httpClient.get<any>(url)));
      }, 1000);



    }

  }
  async getTweet() {

    const url = `${environment.apiUrl}/tweets`;

    this._tweets.next(await firstValueFrom(this.httpClient.get<any>(url)));


  }

  async getTweetUser(id: any = this.idUser) {

    this.idUser = id;
    console.log(id);
    if (id) {

      const url = `${environment.apiUrl}/tweets/id/${id}`;
      this._tweetsUser.next(await firstValueFrom(this.httpClient.get<any>(url)));

    }
  }

  ordenarMasPopular(countLike: any, tweets: any, array: any[]): void {

    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      const cantidad = this.getCountLike(countLike, element._id)
      element.cant = cantidad
    }

    let cloned = [...array];
    cloned.sort((a, b) => b.cant - a.cant);
    tweets.set(cloned)
  }
  ordenarMenosPopular(countLike: any, tweets: any, array: any[]): void {

    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      const cantidad = this.getCountLike(countLike, element._id)
      element.cant = cantidad
    }

    let cloned = [...array];
    cloned.sort((a, b) => a.cant - b.cant);
    tweets.set(cloned)
  }

  ordenarMasNuevos(tweets: any, array: any[]): void {
    if (Array.isArray(array)) {



      let cloned = [...array];

      tweets.set(cloned.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    }
  }


  ordenarMasViejos(tweets: any, array: any[]): void {
    if (Array.isArray(array)) {

      let cloned = [...array];


      tweets.set(cloned.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));

    }
  }



  getTimeAgo(fecha: any) {

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

    const secondsElapsed = getSecondsDiff(fecha);
    const obj: any = getUnitAndValueDate(secondsElapsed);


    if (obj.unit === "day" && obj.value < -1) {
      const date = new Date(fecha);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }

    const rtf = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" });



    return rtf.format(-Math.abs(obj.value), obj.unit);



  };





  getCountCommnet(countComment: any, id: any) {
    let cantidad = 0;
    for (let i = 0; i < countComment[0].length; i++) {
      const comment = countComment[0][i];
      if (comment.tweet === id) {
        cantidad++;
      }
    }
    return cantidad;
  }

  getCountLike(countLike: any, id: any) {
    let cantidad = 0;

    for (let i = 0; i < countLike[0].length; i++) {
      const like = countLike[0][i];
      if (like.id === id) {
        cantidad++;
      }
    }
    return cantidad;
  }

  like(likes: any, id: any) {

    for (let i = 0; i < likes[0].length; i++) {

      if (likes[0][i]?.id === id) {

        return [likes[0][i]?.like, likes[0][i]._id];

      }

    }

    return false;

  }


  onLike(likes: any, id: any, like: any) {



    const url = `${environment.apiUrl}/likes`;


    for (let i = 0; i < likes[0].length; i++) {

      if (likes[0][i]?.id === id) {

        console.log("update");
        console.log(like[1]);

        const url = `${environment.apiUrl}/likes/${like[1]}`;

        this.httpClient.put<any>(url, { id, isTweet: !likes[0][i].like }).subscribe(async (response: any) => {

          console.log("update");
          this.getTweet();
          this.getTweetUser();
          this.getTweetId(this.tweetId);



        })
        return
      }

    }



    console.log("create");


    this.httpClient.post<any>(url, { id, isTweet: true }).subscribe(async (response: any) => {


      console.log("create");
      this.getTweet();
      this.getTweetUser();
      this.getTweetId(this.tweetId);



    })

  }


}
