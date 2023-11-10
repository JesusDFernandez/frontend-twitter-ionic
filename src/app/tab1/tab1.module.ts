import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { TweetComponent } from '../components/tweet/tweet.component';
import { TweetComponentModule } from '../components/tweet/tweet.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule,
    TweetComponentModule
  ],
  declarations: [
    Tab1Page,
  ]
})
export class Tab1PageModule { }
