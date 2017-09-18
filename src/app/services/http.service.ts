import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { User } from "../models/user";

@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  getUserToken(login: string, password: string) : Observable<User>{
    return this.http.get('http://localhost:61595/api/auth/GetUserToken?login=' + login + '&password=' + password)
                    .map(response => response.json());
  }
}
