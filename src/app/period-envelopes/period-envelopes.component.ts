import { Component, OnInit } from '@angular/core';
import { PrivateService } from '../services/private.service';

@Component({
  selector: 'app-period-envelopes',
  templateUrl: './period-envelopes.component.html',
  styleUrls: ['./period-envelopes.component.css']
})
export class PeriodEnvelopesComponent implements OnInit {

  constructor(private privateService: PrivateService) { }

  ngOnInit() {
    this.privateService.getProjects().subscribe(
      data => {
        alert(data);
      }
    );
  }

}
