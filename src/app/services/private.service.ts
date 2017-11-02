import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { BalanceValue, BalanceValueType } from '../view-models/balance-value';
import { DateService } from '../services/date.service';
import { MoneyPipe } from '../pipes/money.pipe';

@Injectable()
export class PrivateService {

  constructor(private httpService: HttpService, private dateService: DateService,
    private moneyPipe: MoneyPipe) { }

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
    value.description = 'Общая сумма денежных остатков на период, с учетом планов поступлений и расходов.';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.AvailableSaldoByDay;
    value.name = 'Допустимый расход в день';
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.FreeSum;
    value.name = 'Можно еще потратить';
    value.description = 'Эта сумма, которая не обременена расходами и может быть потрачена на незапланированные нужды.';
    value.showInHeader = true;
    balanceValues.push(value);

    value = new BalanceValue();
    value.valueType = BalanceValueType.Conclusion;
    value.name = 'Вывод';
    balanceValues.push(value);

    return balanceValues;
  }

  analyzeFreeSum(availableSaldoByDay: number, criticalSaldoByDay: number): number {
    if (availableSaldoByDay < 0) {
      return -1;
    }

    if (criticalSaldoByDay && availableSaldoByDay > criticalSaldoByDay * 1.2) {
      return 1;
    }

    if (!criticalSaldoByDay
      || (availableSaldoByDay > criticalSaldoByDay && availableSaldoByDay <= criticalSaldoByDay * 1.2)) {
      return 0;
    }

    if (criticalSaldoByDay
      && availableSaldoByDay <= criticalSaldoByDay) {
      return -1;
    }

  }

  fillBalance(project: Project, envelopes: Envelope[], balanceValues: BalanceValue[]): number {
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
    let availableSaldoByDay = availableSaldo / days;
    let sign = this.analyzeFreeSum(availableSaldoByDay, project.CriticalSaldoByDay);

    balanceValues.forEach(x => {
      switch (x.valueType) {
        case BalanceValueType.StartSaldo:
          x.value = this.moneyPipe.transform(startSaldo);
          break;
        case BalanceValueType.SumInDebet:
          x.value = this.moneyPipe.transform(sumInDebet);
          break;
        case BalanceValueType.SumIn:
          x.value = this.moneyPipe.transform(sumIn);
          break;
        case BalanceValueType.SumOut:
          x.value = this.moneyPipe.transform(sumOut);
          break;
        case BalanceValueType.AvailableSaldo:
          x.value = this.moneyPipe.transform(availableSaldo);
          break;
        case BalanceValueType.AvailableSaldoByDay:
          x.value = this.moneyPipe.transform(availableSaldoByDay);
          break;
        case BalanceValueType.FreeSum:
          x.value = this.moneyPipe.transform(availableSaldo - (days * (project.CriticalSaldoByDay ? project.CriticalSaldoByDay : 0)));
          break;
        case BalanceValueType.Conclusion:
          switch (sign) {
            case 1:
              x.value = 'Все хорошо';
              x.description = 'Ваших денежных средств достаточно для покрытия плановых расходов текущего периода.';
              break;
            case -1:
              x.value = 'Денег не хватает!';
              x.description = 'Ваших денежных средств недостаточно для покрытия плановых расходов текущего периода. Сумма допустимого расхода в день опустилась ниже критического порога расходов. Пора начать экономить.';
              break;
            case 0:
              x.value = 'Внимательнее к расходам';
              x.description = 'Ваших денежных средств пока достаточно для покрытия плановых расходов текущего периода, но критический порог расходов в день уже близко. Возможно, пора задуматься об экономии.';
            }
          break;
      }
    });

    return sign;
  }
}
