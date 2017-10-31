import { Component, OnInit } from '@angular/core';
import { PrivateService } from '../services/private.service';
import 'rxjs/add/operator/switchMap';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { DomSanitizer } from '@angular/platform-browser';
import { EnvelopePlan } from '../models/envelope-plan';
import * as _ from 'underscore';
import { DateService } from '../services/date.service';
import { BalanceValue } from '../view-models/balance-value';

@Component({
  selector: 'app-period-envelopes',
  templateUrl: './period-envelopes.component.html',
  styleUrls: ['./period-envelopes.component.css']
})
export class PeriodEnvelopesComponent implements OnInit {
  projects: Project[];
  selectedProject: Project = new Project();
  envelopes: Envelope[];
  balanceCssClass: string;
  balanceValues: BalanceValue[];
  balanceValuesInHeader: BalanceValue[];

  constructor(private privateService: PrivateService, private dateService: DateService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    //Инициализируем показатели баланса.
    this.balanceValues = this.privateService.getBalanceValues();
    this.balanceValuesInHeader = this.balanceValues.filter(x => x.showInHeader);
    this.balanceCssClass = "freeSumHigh";

    //Загружаем проекты и конверты.
    this.privateService.getProjects()
      .switchMap(projects => {
        let project = projects.find(x => x.IsDefault);
        this.projects = projects;
        this.selectedProject = project;

        return this.privateService.getEnvelopes([project.Id], project.PeriodStartDate, project.PeriodEndDate);
      })
      .subscribe(envelopes => {
        envelopes.forEach(x => this.fillEnvelopeViewModel(x));
        this.envelopes = this.getSortedEnvelopes(envelopes);
      });
  }

  fillEnvelopeViewModel(env: Envelope) {
    env.background = this.getEnvelopeBackground(env.ImageUrl);
    env.nameClass = this.getEnvelopeNameClass(env);
    env.currentAmountClass = this.getEnvelopeCurrentAmountClass(env);
    env.completePercentStr = this.getCompletePercent(env);

    env.Plans.forEach(plan => this.fillEnvelopePlanViewModel(env, plan));
  }

  fillEnvelopePlanViewModel(env: Envelope, plan: EnvelopePlan) {
    plan.ActionDate = this.dateService.getDateObject(plan.ActionDate);

    if (!env.firstPlan) {
      env.firstPlan = plan;
    }
    if (!env.firstPlanIn && plan.IsIncoming) {
      env.firstPlanIn = plan;
    }
    if (!env.firstPlanOut && !plan.IsIncoming) {
      env.firstPlanOut = plan;
    }

    plan.cssClass = this.getEnvelopePlanSumClass(env, plan);
  }

  getSortedEnvelopes(envelopes: Envelope[]) {
    let futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 100);
    return envelopes.sort((a, b) => this.sortEnvelopesComparer(a, b, futureDate));
  }

  sortEnvelopesComparer(a: Envelope, b: Envelope, futureDate: Date): number {
    //По минимальной дате плана.
    let minPlanDate1 = a.firstPlan ? a.firstPlan.ActionDate : futureDate;
    let minPlanDate2 = b.firstPlan ? b.firstPlan.ActionDate : futureDate;
    if (minPlanDate1 > minPlanDate2) {
      return 1;
    }
    if (minPlanDate1 < minPlanDate2) {
      return -1;
    }

    //По сумме первого плана (desc).
    let planAmount1 = a.firstPlan ? a.firstPlan.PlanAmount : 0;
    let planAmount2 = b.firstPlan ? b.firstPlan.PlanAmount : 0;
    if (planAmount1 > planAmount2) {
      return -1;
    }
    if (planAmount1 < planAmount2) {
      return 1;
    }

    //По текущей сумме (desc).
    if (a.CurrentAmount > b.CurrentAmount) {
      return -1;
    }
    if (a.CurrentAmount < b.CurrentAmount) {
      return 1;
    }

    return 0;
  }

  getEnvelopeBackground(imageUrl: string) {
    if (!imageUrl) {
      imageUrl = '/assets/images/envelope.png';
    }

    return this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }

  getEnvelopeNameClass(envelope: Envelope): string {
    var addClass = '';

    if (envelope.IsDebet) {
      addClass = 'debetEnvelope';
    } else {
      if (envelope.IsExternalCurrentAmount) {
        addClass = 'externalEnvelope';
      }
    }

    return true /*viewSettings.AlwaysShowEnvelopeNames || scope.isMouseOver || !scope.envelope.ImageUrl*/
      ? 'envelopeName ' + addClass
      : 'envelopeNameHidden';
  }

  getEnvelopeCurrentAmountClass(envelope: Envelope): string {
    if (envelope.IsExternalCurrentAmount) {
      return 'externalEnvelope';
    }

    return envelope.IsDebet ? 'debetEnvelope' : '';
  }

  getCompletePercent(envelope: Envelope): string {
    return envelope.TargetAmount
      ? Math.round((envelope.CurrentAmount / envelope.TargetAmount) * 100).toString() + '%'
      : '';
  }

  getEnvelopePlanSumClass(envelope: Envelope, plan: EnvelopePlan) {
    if (envelope.IsDebet && plan.IsIncoming) {
      return 'envelopePlanInDebet';
    }

    return plan.IsIncoming ? 'envelopePlan' : 'envelopePlanOut';
  }

  showHideAllPlans(envelope: Envelope, plan: EnvelopePlan) {
    if (envelope.allPlansForShow) {
      envelope.allPlansForShow = null;
      return;
    }

    envelope.allPlansAlign = plan.IsIncoming ? "start stretch" : "end stretch";
    envelope.allPlansForShow = envelope.Plans.filter(x => x.IsIncoming == plan.IsIncoming);

    let plansSum = 0;
    envelope.allPlansForShow.forEach(x => plansSum = plansSum + x.PlanAmount);
    envelope.allPlansSum = plansSum;
  }
}
