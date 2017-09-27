import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';
import { MdButtonModule, 
  MdInputModule,
  MdCheckboxModule,
  MdIconModule,
  MdMenuModule,
  MdCardModule,
  MdToolbarModule,
  MdDialogModule
 } from '@angular/material';

import { GlobalErrorHandler } from './global-error-handler';
import { AuthGuard }   from './auth.guard';

import {UserService} from './services/user.service';
import {HttpService} from './services/http.service';
import {DialogService} from './services/dialog.service';
import {ErrorService} from './services/error.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PeriodEnvelopesComponent } from './period-envelopes/period-envelopes.component';
import { HomeComponent } from './home/home.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';

// определение маршрутов
const appRoutes: Routes =[
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'period-envelopes', component: PeriodEnvelopesComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PeriodEnvelopesComponent,
    HomeComponent,
    ErrorDialogComponent
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule,
    MdButtonModule, 
    MdInputModule,
    MdCheckboxModule,    
    MdIconModule,
    MdMenuModule,
    MdCardModule,
    MdToolbarModule,
    MdDialogModule
  ],
  providers: [UserService, AuthGuard, HttpService, DialogService, ErrorService, CookieService,
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }