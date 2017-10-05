import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { User } from "../models/user";
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Project } from '../models/project';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {
  private baseUrl = 'http://localhost:61595/api/';

  constructor(private http: HttpClient) { }

  getUserToken(login: string, passwordHash: string) : Observable<User>{
    return this.http.get<User>(this.baseUrl + 'auth/GetUserToken',
    {
      params: new HttpParams()
        .set('login', login)
        .set('password', passwordHash),
    });
  }

  getProjects() : Observable<Project[]>{
    return this.http.get<Project[]>(this.baseUrl + 'private/GetProjectsTest');
  }
}
