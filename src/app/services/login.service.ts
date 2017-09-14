import { Injectable } from '@angular/core';
import { User, UserRole } from "../models/user";
import {HttpService} from './http.service';

@Injectable()
export class LoginService {

  /**Текущий пользователь. */
  public user: User;

  constructor(private httpService: HttpService) {
    this.user = new User();
    this.user.login = 'guest';
    this.user.role = UserRole.Public;
   }

  isAuthenticated(): boolean {
    return this.user && this.user.role != UserRole.Public;
  }

  login(login: string, password: string) {
    alert(login);   
  }
}
