import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Envelope } from '../models/envelope';
import { BalanceValue, BalanceValueType } from '../view-models/balance-value';

@Injectable()
export class PrivateService {

  constructor(private httpService: HttpService) { }

  getProjects() : Observable<Project[]>{
    return this.httpService.getProjects();
  }

  getEnvelopes(projectIds: number[], startDate: Date, endDate: Date) : Observable<Envelope[]>{
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
}
