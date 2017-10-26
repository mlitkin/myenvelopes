import { Component, OnInit } from '@angular/core';
import { PrivateService } from '../services/private.service';
import 'rxjs/add/operator/switchMap';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { DomSanitizer } from '@angular/platform-browser';
import { EnvelopePlan } from '../models/envelope-plan';

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

  constructor(private privateService: PrivateService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.balanceCssClass = "freeSumHigh";
    this.privateService.getProjects()
      .switchMap(projects => {
        let project = projects.find(x => x.IsDefault);
        this.projects = projects;
        this.selectedProject = project;

        return this.privateService.getEnvelopes([project.Id], project.PeriodStartDate, project.PeriodEndDate);
      })
      .subscribe(envelopes => {
        envelopes.forEach(env => {
          env.background = this.getEnvelopeBackground(env.ImageUrl);
          env.nameClass = this.getEnvelopeNameClass(env);
          env.currentAmountClass = this.getEnvelopeCurrentAmountClass(env);
          env.completePercentStr = this.getCompletePercent(env);

          env.Plans.forEach(plan => {
            if (!env.firstPlanIn && plan.IsIncoming) {
              env.firstPlanIn = plan;
            }
            if (!env.firstPlanOut && !plan.IsIncoming) {
              env.firstPlanOut = plan;
            }

            plan.cssClass = this.getEnvelopePlanSumClass(env, plan);
          });
        });

        this.envelopes = envelopes;
      });
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
