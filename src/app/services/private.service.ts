import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';

@Injectable()
export class PrivateService {

  constructor(private httpService: HttpService) { }

  getProjects() : Observable<Project[]>{
    return this.httpService.getProjects();
  }

  getEnvelopes(projectIds: number[], startDate: Date, endDate: Date) : Observable<Envelope[]>{
    return this.httpService.getEnvelopes(projectIds, startDate, endDate);
  }
}
