import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TweetPageRoutingModule } from './tweet-routing.module';

import { TweetPage } from './tweet.page';
import { TweetComponentModule } from '../components/tweet/tweet.module';
import { TweetComponent } from '../components/tweet/tweet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TweetPageRoutingModule,
    ReactiveFormsModule,
    TweetComponentModule

  ],
  declarations: [TweetPage]
})
export class TweetPageModule { }
