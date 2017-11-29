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
  selectedPlan: EnvelopePlan;
  changedPlans: EnvelopePlan[];
  startDate: Date;
  endDate: Date;

  constructor(private privateService: PrivateService, private activateRoute: ActivatedRoute, private router: Router,
    private dataService: DataService, private dateService: DateService, private location: Location) {
    this.envelope = new Envelope();
    this.envelope.Name = 'Новый конверт';
    this.changedPlans = [];
  }

  ngOnInit() {
    if (!this.dataService.envelopes) {
      this.redirectToPeriodEnvelopes();
      return;
    }

    this.startDate = this.dateService.getDateObject(this.dataService.startDate);
    this.endDate = this.dateService.getDateObject(this.dataService.endDate);

    let id = this.activateRoute.snapshot.params['id'];
    this.projects = this.dataService.projects;
    if (id > 0) {
      let envelope = this.dataService.envelopes.find(x => x.Id == id);
      this.envelope = this.privateService.cloneObject(envelope);
    } else {
      this.envelope = new Envelope();
      this.envelope.Name = 'Новый конверт';
    }
  }

  redirectToPeriodEnvelopes() {
    this.router.navigate(['period-envelopes']);
  }

  save(form: NgForm) {
    let envelopeForSend = this.privateService.cloneEnvelopeForSend(this.envelope, this.changedPlans);

    this.privateService.saveEnvelope(envelopeForSend)
      .subscribe(res => {
        this.envelope.Id = res.Id;
        this.envelope.ImageUrl = res.ImageUrl;
        this.envelope.DeletedPlanIds = [];

        for (var i = 0; i < res.PlanIds.length; i++) {
          let planId = res.PlanIds[i];
          let plan = _.findWhere(this.envelope.Plans, { ClientId: planId.ClientId });
          plan.Id = planId.Id;
        }

        if (!this.envelope.CurrentAmount) {
          this.envelope.CurrentAmount = 0;
        }

        if (this.envelope.Id > 0) {
          let i = _.findIndex(this.dataService.envelopes, x => x.Id == this.envelope.Id);

          //Оставляем только невыполненные планы в периоде.
          this.envelope.Plans = this.envelope.Plans.filter(plan => {
            if (plan.Completed) {
              return false;
            }

            let actionDate = this.dateService.getDateObject(plan.ActionDate);

            return actionDate >= this.startDate
              && actionDate <= this.endDate;
          });

          this.dataService.envelopes[i] = this.envelope;
        }
        this.location.back();
      });
  }

  onBackClick() {
    this.location.back();
  }

  changePlanSign(plan: EnvelopePlan) {
    plan.IsIncoming = !plan.IsIncoming;
    plan.viewModel.cssClass = this.privateService.getEnvelopePlanSumClass(this.envelope, plan);

    this.planChanged(plan);
  }

  addPlan() {
    let newPlan = new EnvelopePlan()
    newPlan.ActionDate = this.dateService.getCurrentDate();
    newPlan.ClientId = this.dateService.getUniqueIdByDate();
    newPlan.IsIncoming = this.envelope.TargetAmount ? true : false;
    newPlan.viewModel.cssClass = this.privateService.getEnvelopePlanSumClass(this.envelope, newPlan);

    this.envelope.Plans.push(newPlan);

    return false;
  }

  planDateChanged(plan: EnvelopePlan) {
    this.envelope.Plans = _.sortBy(this.envelope.Plans, obj => this.dateService.getDateObject(obj.ActionDate));
    this.planChanged(plan);
  }

  planMenuOpened(plan: EnvelopePlan) {
    this.selectedPlan = plan;
  }

  changePlanCompleted() {
    if (!this.selectedPlan) {
      return;
    }

    this.selectedPlan.Completed = !this.selectedPlan.Completed;
    this.planChanged(this.selectedPlan);
  }

  deletePlan() {
    if (!this.selectedPlan) {
      return;
    }

    let compareFunc;
    let selectedPlan = this.selectedPlan;
    if (this.selectedPlan.Id > 0) {
      this.envelope.DeletedPlanIds.push(this.selectedPlan.Id);
      compareFunc = function (plan) {
        return plan.Id == selectedPlan.Id;
      };
    } else {
      compareFunc = function (plan) {
        return plan == selectedPlan;
      };
    }

    this.envelope.Plans = _.reject(this.envelope.Plans, compareFunc);
    this.changedPlans = _.reject(this.changedPlans, compareFunc);
  }

  planChanged(plan: EnvelopePlan) {
    let existsPlan = this.getExistedPlan(plan, this.changedPlans);
    if (!existsPlan) {
      this.changedPlans.push(plan);
    }
  }

  getExistedPlan(envelopePlan: EnvelopePlan, plans: EnvelopePlan[]): EnvelopePlan {
    return _.find(plans, function (plan) {
      if (plan == envelopePlan) {
        return true;
      }

      if (plan.Id > 0 && envelopePlan.Id > 0 && plan.Id == envelopePlan.Id) {
        return true;
      }

      return false;
    });
  };
}
