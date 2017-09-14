import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private login: string;
  private password: string;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  submit(form: NgForm){
    this.loginService.login(this.login, this.password);
  }
}
