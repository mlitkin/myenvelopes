import { Component, OnInit } from '@angular/core';
import { PrivateService } from '../services/private.service';
import 'rxjs/add/operator/switchMap';
import { List } from 'linqts';
import { Project } from '../models/project';

@Component({
  selector: 'app-period-envelopes',
  templateUrl: './period-envelopes.component.html',
  styleUrls: ['./period-envelopes.component.css']
})
export class PeriodEnvelopesComponent implements OnInit {

  constructor(private privateService: PrivateService) { }

  ngOnInit() {
    this.privateService.getProjects()
    .switchMap(projects => {
      let project = new List<Project>(projects)
      .Where(x => x.IsDefault)
      .FirstOrDefault();

      return this.privateService.getEnvelopes([ project.Id ], project.PeriodStartDate, project.PeriodEndDate);
    })
    .subscribe(
      data => {
        //alert(data);
      }
    );
  }

}
