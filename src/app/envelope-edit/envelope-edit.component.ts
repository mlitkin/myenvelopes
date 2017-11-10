import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Envelope } from '../models/envelope';
import { Project } from '../models/project';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-envelope-edit',
  templateUrl: './envelope-edit.component.html',
  styleUrls: ['./envelope-edit.component.css']
})
export class EnvelopeEditComponent implements OnInit {
  envelope: Envelope;
  projects: Project[];

  constructor(private activateRoute: ActivatedRoute, private router: Router, private dataService: DataService) {
    this.envelope = new Envelope();
    this.envelope.Name = 'Новый конверт';
  }

  ngOnInit() {
    if (!this.dataService.envelopes) {
      this.router.navigate(['period-envelopes']);
      return;
    }

    this.projects = this.dataService.projects;
    let id = this.activateRoute.snapshot.params['id'];
    if (id > 0) {
      this.envelope = this.dataService.envelopes.find(x => x.Id == id);
    }
  }

  save(form: NgForm) {
    alert(1);
  }
}