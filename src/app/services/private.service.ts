import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { BalanceValue, BalanceValueType } from '../view-models/balance-value';
import { DateService } from '../services/date.service';
import { MoneyPipe } from '../pipes/money.pipe';
import { EnvelopePlan } from '../models/envelope-plan';
import { SaveEnvelopeResult } from '../models/save-envelope-result';

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

    if (criticalSaldoByDay) {
      let limit = criticalSaldoByDay * 1.2;

      if (availableSaldoByDay > limit) {
        return 1;
      }

      if (availableSaldoByDay >= criticalSaldoByDay && availableSaldoByDay <= limit) {
        return 0;
      }

      if (availableSaldoByDay < criticalSaldoByDay) {
        return -1;
      }
    } else {
      if (availableSaldoByDay > 0) {
        return 1;
      } else {
        return -1;
      }
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

      let envelopeSumIn = 0;
      let envelopeSumOut = 0;
      envelope.Plans.forEach(plan => {
        if (plan.IsIncoming) {
          envelopeSumIn = envelopeSumIn + plan.PlanAmount;
        } else {
          envelopeSumOut = envelopeSumOut + plan.PlanAmount;
        }
      });

      sumOut = sumOut + envelopeSumOut;
      if (envelope.IsDebet) {
        sumInDebet = sumInDebet + envelopeSumIn;
        availableSaldo = availableSaldo + envelopeSumIn - envelopeSumOut;
      } else {
        sumIn = sumIn + envelopeSumIn;
        availableSaldo = availableSaldo - envelopeSumIn;
        let diff = envelope.CurrentAmount + envelopeSumIn - envelopeSumOut;
        if (diff < 0) {
          availableSaldo = availableSaldo + diff;
        }
      }
    });

    let days = this.dateService.getDaysBetweenDates(this.dateService.getCurrentDate(), project.PeriodEndDate);
    if (days == 0) {
      days = 1;
    }
    let availableSaldoByDay = 0;
    let sign = -1;
    let freeSum = 0;

    if (days > 0) {
      availableSaldoByDay = availableSaldo / days;
      sign = this.analyzeFreeSum(availableSaldoByDay, project.CriticalSaldoByDay);
      freeSum = availableSaldo - (days * (project.CriticalSaldoByDay ? project.CriticalSaldoByDay : 0));
    }

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
          x.value = this.moneyPipe.transform(freeSum);
          break;
        case BalanceValueType.Conclusion:
          if (days > 0) {
            switch (sign) {
              case 1:
                x.value = 'Все хорошо';
                x.description = 'Ваших денежных средств достаточно для покрытия плановых расходов текущего периода.';
                break;
              case -1:
                x.value = 'Денег не хватает';
                x.description = 'Ваших денежных средств недостаточно для покрытия плановых расходов текущего периода. Сумма допустимого расхода в день опустилась ниже критического порога расходов. Пора начать экономить.';
                break;
              case 0:
                x.value = 'Внимательнее к расходам';
                x.description = 'Ваших денежных средств пока достаточно для покрытия плановых расходов текущего периода, но критический порог расходов в день уже близко. Возможно, пора задуматься об экономии.';
            }
          } else {
            x.value = 'Неверно указан период';
            x.description = 'Дата завершения периода должна быть больше текущей даты.';
          }
          break;
      }
    });

    return sign;
  }

  getEnvelopePlanSumClass(envelope: Envelope, plan: EnvelopePlan) {
    if (envelope.IsDebet && plan.IsIncoming) {
      return 'envelopePlanInDebet';
    }

    return plan.IsIncoming ? 'envelopePlan' : 'envelopePlanOut';
  }

  saveEnvelope(envelope: Envelope): Observable<SaveEnvelopeResult> {
    return this.httpService.saveEnvelope(envelope);
  }

  cloneObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  cloneEnvelopeForSend(envelope: Envelope, changedPlans: EnvelopePlan[]): Envelope {
    let result = this.cloneObject(envelope);
    result.Plans = this.cloneObject(changedPlans);
    result.Plans.forEach(x => {
      x.ActionDate = this.dateService.getDateJson(x.ActionDate);
      x.viewModel = undefined;
    });
    result.viewModel = undefined;
    
    return result;
  }

  /*extend(target: any, source: any) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          this.extend(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }

    return target;
  }

  isObject(val: any): boolean {
    if (val === null) { 
      return false; 
    }

    return typeof val === 'object';
  }*/
}
