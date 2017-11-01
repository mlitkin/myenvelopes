import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { BalanceValue, BalanceValueType } from '../view-models/balance-value';
import { DateService } from '../services/date.service';

@Injectable()
export class PrivateService {

  constructor(private httpService: HttpService, private dateService: DateService) { }

  getProjects(): Observable<Project[]> {
    return this.httpService.getProjects();
  }

  getEnvelopes(projectIds: number[], startDate: Date, endDate: Date): Observable<Envelope[]> {
    return this.httpService.getEnvelopes(projectIds, startDate, endDate);
  }

  getBalanceValues(): BalanceValue[] {
    let balanceValues = new Array<BalanceValue>();

    let value = new BalanceValue();
    value.valueType = BalanceValueType.StartSaldo;
    value.name = 'Текущие остатки';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.SumInDebet;
    value.name = 'Запланировано поступлений';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.SumIn;
    value.name = 'Запланировано отложить';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.SumOut;
    value.name = 'Запланировано потратить';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.AvailableSaldo;
    value.name = 'Остаток на конец периода';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.AvailableSaldoByDay;
    value.name = 'Допустимый расход в день';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.FreeSum;
    value.name = 'Можно еще потратить';
    value.showInHeader = true;
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.Conclusion;
    value.name = 'Вывод';
    balanceValues.push(value);

    return balanceValues;
  }

  FillBalance(project: Project, envelopes: Envelope[], balanceValues: BalanceValue[]) {
    let startSaldo = 0;
    let sumInDebet = 0;
    let sumIn = 0;
    let sumOut = 0;
    let availableSaldo = 0;

    envelopes.forEach(envelope => {
      if (!envelope.Enabled) {
        return;
      }

      if (envelope.IsDebet) {
        startSaldo = startSaldo + envelope.CurrentAmount;
        availableSaldo = availableSaldo + envelope.CurrentAmount;
      } else {
        if (!envelope.IsExternalCurrentAmount) {
          availableSaldo = availableSaldo - envelope.CurrentAmount;
        }
      }

      envelope.Plans.forEach(plan => {
        if (envelope.IsDebet) {
          if (plan.IsIncoming) {
            sumInDebet = sumInDebet + plan.PlanAmount;
            availableSaldo = availableSaldo + plan.PlanAmount;
          } else {
            sumOut = sumOut + plan.PlanAmount;
            availableSaldo = availableSaldo - plan.PlanAmount;
          }
        } else {
          if (plan.IsIncoming) {
            sumIn = sumIn + plan.PlanAmount;
          } else {
            sumOut = sumOut + plan.PlanAmount;
          }

          if (!envelope.IsExternalCurrentAmount || plan.IsIncoming) {
            availableSaldo = availableSaldo - plan.PlanAmount;
          }
        }
      });
    });

    let days = this.dateService.getDaysBetweenDates(this.dateService.getCurrentDate(), project.PeriodEndDate);
    if (days == 0) {
        days = 1;
    }
    balanceValues.forEach(x => {
      switch (x.valueType) {
        case BalanceValueType.StartSaldo:
          x.amount = startSaldo;
          break;
        case BalanceValueType.SumInDebet:
          x.amount = sumInDebet;
          break;
        case BalanceValueType.SumIn:
          x.amount = sumIn;
          break;
        case BalanceValueType.SumOut:
          x.amount = sumOut;
          break;
        case BalanceValueType.AvailableSaldo:
          x.amount = availableSaldo;
          break;
        case BalanceValueType.AvailableSaldoByDay:
          x.amount = availableSaldo / days;
          break;
        case BalanceValueType.FreeSum:
          x.amount = availableSaldo - (days * 300);
          break;
      }
    });
  }
}
