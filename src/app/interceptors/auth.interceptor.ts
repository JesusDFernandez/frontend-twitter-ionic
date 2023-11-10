import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookies: CookieService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let clonedRequest = request;

    if (this.cookies.get("token")) {

      clonedRequest = request.clone({
        setHeaders: {
          Authorization: this.cookies.get("token")
        }
      })

    }

    return next.handle(clonedRequest);
  }
}
