import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public login: string;
  public password: string;
  private subscription: Subscription;

  constructor(private userService: UserService, private activateRoute: ActivatedRoute) {
    this.subscription = activateRoute.queryParams.subscribe(params => {
      let returnPath = params['returnPath'];
      if (returnPath) {
        this.userService.tryLoginByCookie(returnPath);  
      }
    });
   }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit(form: NgForm){
    this.userService.login(this.login, this.password);
  }
}
