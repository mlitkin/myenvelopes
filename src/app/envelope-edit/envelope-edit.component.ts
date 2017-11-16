import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Envelope } from '../models/envelope';
import { Project } from '../models/project';
import { NgForm } from '@angular/forms';
import * as _ from 'underscore';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { EnvelopePlan } from '../models/envelope-plan';
import { PrivateService } from '../services/private.service';

@Component({
  selector: 'app-envelope-edit',
  templateUrl: './envelope-edit.component.html',
  styleUrls: ['./envelope-edit.component.css']
})
export class EnvelopeEditComponent implements OnInit {
  envelope: Envelope;
  projects: Project[];

  constructor(private privateService: PrivateService, private activateRoute: ActivatedRoute, private router: Router, 
    private dataService: DataService, private location: Location) {
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

  changePlanSign(plan: EnvelopePlan) {
    plan.IsIncoming = !plan.IsIncoming;
    plan.cssClass = this.privateService.getEnvelopePlanSumClass(this.envelope, plan);
  }
}
