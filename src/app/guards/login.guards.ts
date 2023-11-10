import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const loginGuards = () => {

    const cookies = inject(CookieService);
    const router = inject(Router)

    if (cookies.get("token")) {
        return true;
    }
    else {
        router.navigate(["/login"]);
        return false;
    }

}

export const loginVerifyGuards = () => {

    const cookies = inject(CookieService);
    const router = inject(Router)

    if (cookies.get("token")) {
        router.navigate(["/tabs"]);
        return false;
    }
    else {
        return true;
    }

}
