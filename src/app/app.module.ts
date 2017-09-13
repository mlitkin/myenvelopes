import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, 
  MdInputModule,
  MdCheckboxModule,
  MdIconModule,
  MdMenuModule,
  MdCardModule,
  MdToolbarModule
 } from '@angular/material';
import {Routes, RouterModule} from '@angular/router';

import { AuthGuard }   from './auth.guard';
import {LoginService} from './services/login.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PeriodEnvelopesComponent } from './period-envelopes/period-envelopes.component';
import { HomeComponent } from './home/home.component';

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
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MdButtonModule, 
    MdInputModule,
    MdCheckboxModule,    
    MdIconModule,
    MdMenuModule,
    MdCardModule,
    MdToolbarModule
  ],
  providers: [LoginService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }