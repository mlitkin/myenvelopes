import { Injectable } from '@angular/core';
import { User, UserRole } from "../models/user";
import {HttpService} from './http.service';
import {Md5} from 'ts-md5/dist/md5';
import { Router } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class UserService {

  /**Текущий пользователь. */
  public user: User;

  constructor(private httpService: HttpService, private cookieService: CookieService, private router: Router) {
    this.user = new User();
    this.user.login = 'guest';
    this.user.role = UserRole.Public;
   }

  isAuthenticated(): boolean {
    return this.user && this.user.role != UserRole.Public;
  }

  login(login: string, password: string) {
    let passwordHash = Md5.hashStr(password) as string;
    this.httpService.getUserToken(login, passwordHash)
      .subscribe(
        data => {
          this.user = data;

          //Сохраняем данные в куки.
          this.cookieService.put('login', login);
          this.cookieService.put('password', passwordHash);

          this.router.navigate(['period-envelopes']);
        }
      );
  }

  tryLoginByCookie(redirectPath: string): void {
    let login = this.cookieService.get('login');
    let passwordHash = this.cookieService.get('password');
    if (login && passwordHash) {
      this.httpService.getUserToken(login, passwordHash)
      .subscribe(
        data => {
          this.user = data;
          this.router.navigate([redirectPath]);
        }
      );
    }
  }
}
