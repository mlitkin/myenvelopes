import { Component, OnInit } from '@angular/core';
import { PrivateService } from '../services/private.service';
import 'rxjs/add/operator/switchMap';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-period-envelopes',
  templateUrl: './period-envelopes.component.html',
  styleUrls: ['./period-envelopes.component.css']
})
export class PeriodEnvelopesComponent implements OnInit {
  envelopes: Envelope[];

  constructor(private privateService: PrivateService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.privateService.getProjects()
    .switchMap(projects => {
      let project = projects.find(x => x.IsDefault);
      return this.privateService.getEnvelopes([ project.Id ], project.PeriodStartDate, project.PeriodEndDate);
    })
    .subscribe(
      envelopes => {
        envelopes.forEach(env => {
          env.background = this.getEnvelopeBackground(env.ImageUrl);
          env.nameClass = this.getEnvelopeNameClass(env);
          env.currentAmountClass = this.getEnvelopeCurrentAmountClass(env);
          env.completePercentStr = this.getCompletePercent(env);
        });

        this.envelopes = envelopes;
      }
    );
  }

  getEnvelopeBackground(imageUrl: string) {
    if (!imageUrl) {
      imageUrl = '/assets/images/envelope.png';
    }

    return this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }

  getEnvelopeNameClass(envelope: Envelope): string {
    if (!envelope) {
      return;
    }

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
    if (!envelope) {
        return;
    }

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
}
