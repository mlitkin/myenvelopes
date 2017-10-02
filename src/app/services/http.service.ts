import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { User } from "../models/user";
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient) { }

  getUserToken(login: string, passwordHash: string) : Observable<User>{
    return this.http.get<User>('http://localhost:61595/api/auth/GetUserToken',
    {
      params: new HttpParams()
        .set('login', login)
        .set('password', passwordHash),
    });
  }
}
