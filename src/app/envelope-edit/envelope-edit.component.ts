import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
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
import { DateService } from '../services/date.service';

@Component({
  selector: 'app-envelope-edit',
  templateUrl: './envelope-edit.component.html',
  styleUrls: ['./envelope-edit.component.css']
})
export class EnvelopeEditComponent implements OnInit {
  envelope: Envelope;
  projects: Project[];

  constructor(private privateService: PrivateService, private activateRoute: ActivatedRoute, private router: Router,
    private dataService: DataService, private dateService: DateService, private location: Location) {
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

  addPlan() {
    let newPlan = new EnvelopePlan()
    newPlan.ActionDate = this.dateService.getCurrentDate();
    newPlan.ClientId = this.dateService.getUniqueIdByDate();
    newPlan.IsIncoming = this.envelope.TargetAmount ? true : false;
    newPlan.cssClass = this.privateService.getEnvelopePlanSumClass(this.envelope, newPlan);
    
    this.envelope.Plans.push(newPlan);

    return false;
  }
  
  planDateChanged(plan: EnvelopePlan) {
    this.envelope.Plans = _.sortBy(this.envelope.Plans, obj => this.dateService.getDateObject(obj.ActionDate));
  }
}
