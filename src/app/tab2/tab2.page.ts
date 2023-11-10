import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  private router = inject(Router)



  ngOnInit() {

    this.authService.users.subscribe(response => {
      console.log(response);
      this.data = [];

      this.data.push(response)
      this.results.set(response);

    })


  }

  data = <any>[];

  results = signal<any>([this.data]);



  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    console.log(query);
    console.log(this.data);

    this.results.set(this.data[0].filter((d: any) => d.username.toLowerCase().indexOf(query) > -1));



  }

  goToProfile(id: any) {
    console.log(id);

    this.router.navigate(['tabs/profile/' + id]);

  }
}

