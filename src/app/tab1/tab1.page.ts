import { HttpClient } from '@angular/common/http';
import { Component, Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TweetService } from '../services/tweet/tweet.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  httpClient = inject(HttpClient);

  tweetService = inject(TweetService);


  isModalOpen = false;
  image: any;


  tweets = signal<any>([]);


  form: FormGroup;



  private router = inject(Router)


  constructor() {


    this.form = new FormGroup({
      text: new FormControl(),
      image: new FormControl()

    })



  }



  setOpen(isOpen: boolean) { this.isModalOpen = isOpen; }


  async createTweet() {

    console.log(this.form.value);
    const formData = new FormData();

    for (const key of Object.keys(this.form.value)) {
      const value = this.form.value[key];
      formData.append(key, value);
    }


    await this.tweetService.createTweet(formData);
    this.setOpen(false);
    this.form.reset();

  }




  seleccionarArchivo(e: any) {

    const inputTarget = e.target;
    const file = inputTarget.files[0];


    this.form.setValue({ text: this.form.value.text, image: file });


    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {

        const readerTarget = e.target;


        this.image = readerTarget?.result

      });

      reader.readAsDataURL(file);

    }



  }

}