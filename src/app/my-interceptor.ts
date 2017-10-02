import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from './services/user.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userService = this.injector.get(UserService);
        if (userService.isAuthenticated()) {
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Basic ' + userService.user.token)});
            return next.handle(authReq);
        }

        return next.handle(req);
    }
}