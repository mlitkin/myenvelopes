import { Injectable } from '@angular/core';
import { User, UserRole } from "../models/user";

@Injectable()
export class LoginService {

  /**Текущий пользователь. */
  public user: User;

  constructor() {
    this.user = new User();
    this.user.login = 'guest';
    this.user.role = UserRole.Public;
   }

  isAuthenticated(): boolean {
    return this.user && this.user.role != UserRole.Public;
  }
}
