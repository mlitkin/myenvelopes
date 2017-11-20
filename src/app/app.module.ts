import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DecimalPipe } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';

import { MatButtonModule, 
  MatInputModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatToolbarModule,
  MatDialogModule,
  MatSelectModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule
 } from '@angular/material';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import { GlobalErrorHandler } from './global-error-handler';
import { AuthGuard }   from './auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {UserService} from './services/user.service';
import {HttpService} from './services/http.service';
import {DialogService} from './services/dialog.service';
import {ErrorService} from './services/error.service';
import {PrivateService} from './services/private.service';
import {DateService} from './services/date.service';
import {DataService} from './services/data.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PeriodEnvelopesComponent } from './period-envelopes/period-envelopes.component';
import { HomeComponent } from './home/home.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MyInterceptor } from './my-interceptor';
import { MoneyPipe } from './pipes/money.pipe';
import { EnvelopePlansComponent } from './envelope-plans/envelope-plans.component';
import { BalanceValueComponent } from './balance-value/balance-value.component';
import { EnvelopeEditComponent } from './envelope-edit/envelope-edit.component';
import { MoneyDirective } from './directives/money.directive';

// определение маршрутов
const appRoutes: Routes =[
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'period-envelopes', component: PeriodEnvelopesComponent, canActivate: [AuthGuard]},
  { path: 'envelope-edit/:id', component: EnvelopeEditComponent, canActivate: [AuthGuard]},
  { path: 'envelope-plans', component: EnvelopePlansComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PeriodEnvelopesComponent,
    HomeComponent,
    ErrorDialogComponent,
    MoneyPipe,
    EnvelopePlansComponent,
    BalanceValueComponent,
    EnvelopeEditComponent,
    MoneyDirective
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule, 
    MatInputModule,
    MatCheckboxModule,    
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule,
    MatSelectModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule
  ],
  providers: [ DecimalPipe,
    UserService, AuthGuard, HttpService, DialogService, ErrorService, CookieService, PrivateService,
    DateService, MoneyPipe, DataService,
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true,
    },
    { 
      provide: LOCALE_ID,
      useValue: "ru-RU"
    },
    {
      provide: MATERIAL_COMPATIBILITY_MODE, 
      useValue: true
    },
    {
      provide: APP_BASE_HREF, 
      //useValue: '/' //Локально
      useValue: '/ui2/' //Прод
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }