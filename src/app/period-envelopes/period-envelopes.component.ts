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
        this.envelopes = envelopes;
      }
    );
  }

  getEnvelopeBackground(imageUrl: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }
}
