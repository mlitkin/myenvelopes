import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';

@Injectable()
export class PrivateService {

  constructor(private httpService: HttpService) { }

  getProjects() : Observable<Project[]>{
    return this.httpService.getProjects();
  }
}
