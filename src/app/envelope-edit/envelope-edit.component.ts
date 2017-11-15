import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Envelope } from '../models/envelope';
import { Project } from '../models/project';
import { NgForm } from '@angular/forms';
import * as _ from 'underscore';
import { Location } from '@angular/common';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { EnvelopePlan } from '../models/envelope-plan';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-envelope-edit',
  templateUrl: './envelope-edit.component.html',
  styleUrls: ['./envelope-edit.component.css']
})
export class EnvelopeEditComponent implements OnInit {
  envelope: Envelope;
  projects: Project[];
  plansDataSource: EnvelopePlansDataSource;
  displayedColumns = ['ActionDate', 'PlanAmount', 'Description'];

  @ViewChild(MatPaginator) 
  plansPaginator: MatPaginator;

  constructor(private activateRoute: ActivatedRoute, private router: Router, private dataService: DataService,
    private location: Location) {
    this.envelope = new Envelope();
    this.envelope.Name = 'Новый конверт';
  }

  ngOnInit() {
    if (!this.dataService.envelopes) {
      this.redirectToPeriodEnvelopes();
      return;
    }

    let id = this.activateRoute.snapshot.params['id'];
    this.projects = this.dataService.projects;
    if (id > 0) {
      let envelope = this.dataService.envelopes.find(x => x.Id == id);
      this.envelope = <Envelope>JSON.parse(JSON.stringify(envelope));
    } else {
      this.envelope = new Envelope();
      this.envelope.Name = 'Новый конверт';
    }

    this.plansDataSource = new EnvelopePlansDataSource(this.envelope.Plans, this.plansPaginator);
  }

  redirectToPeriodEnvelopes() {
    this.router.navigate(['period-envelopes']);
  }

  save(form: NgForm) {
    if (this.envelope.Id > 0) {
      let i = _.findIndex(this.dataService.envelopes, x => x.Id == this.envelope.Id);
      this.dataService.envelopes[i] = this.envelope;
    }
    this.location.back();
  }

  onBackClick() {
    this.location.back();
  }
}

export class EnvelopePlansDataSource extends DataSource<any> {
  constructor(private data: EnvelopePlan[], private paginator: MatPaginator) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<EnvelopePlan[]> {
    const displayDataChanges = [
      this.data,
      this.paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.data.slice();

      // Grab the page's slice of data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() { }

}