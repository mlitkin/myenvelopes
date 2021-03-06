import { Component, OnInit, Inject } from '@angular/core';
import { PrivateService } from '../services/private.service';
import 'rxjs/add/operator/switchMap';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { DomSanitizer } from '@angular/platform-browser';
import { EnvelopePlan } from '../models/envelope-plan';
import * as _ from 'underscore';
import { DateService } from '../services/date.service';
import { BalanceValue, BalanceValueType } from '../view-models/balance-value';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { EnvelopeViewModel } from '../models/view-models/envelope-view-model';
import { EnvelopePlanViewModel } from '../models/view-models/envelope-plan-view-model';

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
  planDateClassName: string = 'planDate';

  constructor(private privateService: PrivateService, private dateService: DateService, private dataService: DataService,
    private sanitizer: DomSanitizer, private router: Router, @Inject(APP_BASE_HREF) private baseHref: string) { }

  ngOnInit() {
    if (this.dataService.isDataLoaded) {
      //Если данные уже загружены в память.
      this.setBalanceValues(this.dataService.balanceValues);
      this.setProjects(this.dataService.projects);
      this.setEnvelopes(this.dataService.envelopes);

      return;
    }

    //Инициализируем показатели баланса.
    let values = this.privateService.getBalanceValues();
    this.setBalanceValues(values);    
    this.dataService.balanceValues = values;

    //Загружаем проекты и конверты.
    this.privateService.getProjects()
      .switchMap(projects => {
        this.setProjects(projects);
        this.dataService.projects = projects;
        return this.privateService.getEnvelopes([this.selectedProject.Id], this.selectedProject.PeriodStartDate, this.selectedProject.PeriodEndDate);
      })
      .subscribe(envelopes => {
        this.setEnvelopes(envelopes);
        this.dataService.envelopes = envelopes;
        this.dataService.isDataLoaded = true;
      });
  }

  setBalanceValues(balanceValues: BalanceValue[]) {
    this.balanceValues = balanceValues;
    this.balanceValuesInHeader = balanceValues.filter(x => x.showInHeader);
    this.balanceCssClass = 'freeSumMedium';
  }

  setProjects(projects: Project[]) {
    this.projects = projects;
    this.selectedProject = projects.find(x => x.IsDefault);
  }

  setEnvelopes(envelopes: Envelope[]) {
    envelopes.forEach(x => this.fillEnvelopeViewModel(x));
    this.envelopes = this.getSortedEnvelopes(envelopes);
    let sign = this.privateService.fillBalance(this.selectedProject, this.envelopes, this.balanceValues);
    this.calcFreeSumClass(sign);
  }

  calcFreeSumClass(sign: number) {
    switch (sign) {
      case 1:
        this.balanceCssClass = 'freeSumHigh';
        break;
      case -1:
        this.balanceCssClass = 'freeSumLow';
        break;
      default:
        this.balanceCssClass = 'freeSumMedium';
    }
  }

  fillEnvelopeViewModel(env: Envelope) {
    if (!env.viewModel) {
      env.viewModel = new EnvelopeViewModel();
    }

    env.viewModel.background = this.getEnvelopeBackground(env.ImageUrl);
    env.viewModel.nameClass = this.getEnvelopeNameClass(env);
    env.viewModel.currentAmountClass = this.getEnvelopeCurrentAmountClass(env);
    env.viewModel.completePercentStr = this.getCompletePercent(env);
    env.viewModel.firstPlan = null;
    env.viewModel.firstPlanIn = null;
    env.viewModel.firstPlanOut = null;
    env.viewModel.allPlansForShow = null;

    env.Plans.forEach(plan => this.fillEnvelopePlanViewModel(env, plan));
  }

  fillEnvelopePlanViewModel(env: Envelope, plan: EnvelopePlan) {
    if (!plan.viewModel) {
      plan.viewModel = new EnvelopePlanViewModel();
    }

    plan.ActionDate = this.dateService.getDateObject(plan.ActionDate);

    if (!env.viewModel.firstPlan) {
      env.viewModel.firstPlan = plan;
    }
    if (!env.viewModel.firstPlanIn && plan.IsIncoming) {
      env.viewModel.firstPlanIn = plan;
    }
    if (!env.viewModel.firstPlanOut && !plan.IsIncoming) {
      env.viewModel.firstPlanOut = plan;
    }

    plan.viewModel.cssClass = this.privateService.getEnvelopePlanSumClass(env, plan);
  }

  getSortedEnvelopes(envelopes: Envelope[]) {
    let futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 100);
    return envelopes.sort((a, b) => this.sortEnvelopesComparer(a, b, futureDate));
  }

  sortEnvelopesComparer(a: Envelope, b: Envelope, futureDate: Date): number {
    //По минимальной дате плана.
    let minPlanDate1 = a.viewModel.firstPlan ? a.viewModel.firstPlan.ActionDate : futureDate;
    let minPlanDate2 = b.viewModel.firstPlan ? b.viewModel.firstPlan.ActionDate : futureDate;
    if (minPlanDate1 > minPlanDate2) {
      return 1;
    }
    if (minPlanDate1 < minPlanDate2) {
      return -1;
    }

    //По сумме первого плана (desc).
    let planAmount1 = a.viewModel.firstPlan ? a.viewModel.firstPlan.PlanAmount : 0;
    let planAmount2 = b.viewModel.firstPlan ? b.viewModel.firstPlan.PlanAmount : 0;
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
      imageUrl = this.baseHref + 'assets/images/envelope.png';
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

  showHideAllPlans(envelope: Envelope, plan: EnvelopePlan) {
    if (envelope.viewModel.allPlansForShow) {
      envelope.viewModel.allPlansForShow = null;
      return;
    }

    envelope.viewModel.allPlansAlign = plan.IsIncoming ? "start stretch" : "end stretch";
    envelope.viewModel.allPlansForShow = envelope.Plans.filter(x => x.IsIncoming == plan.IsIncoming);

    let plansSum = 0;
    envelope.viewModel.allPlansForShow.forEach(x => plansSum = plansSum + x.PlanAmount);
    envelope.viewModel.allPlansSum = plansSum;
  }

  onEnvelopeClick(envelope: Envelope, $event: any) {
    if ($event.target.className == this.planDateClassName || 
      ($event.target.firstElementChild && $event.target.firstElementChild.className == this.planDateClassName)) {
        //Если это клик по планам - игнорим его.
        return;
      }

    //Открываем конверт на редакцию.
    this.dataService.startDate = this.selectedProject.PeriodStartDate;
    this.dataService.endDate = this.selectedProject.PeriodEndDate;
    this.router.navigate(['envelope-edit', envelope.Id]);
  }
}
