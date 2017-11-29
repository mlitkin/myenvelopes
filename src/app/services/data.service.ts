import { Injectable } from '@angular/core';
import { Envelope } from '../models/envelope';
import { BalanceValue } from '../view-models/balance-value';
import { Project } from '../models/project';

@Injectable()
export class DataService {
  /**Признак, что дата загружена. */
  public isDataLoaded: boolean;

  /**Проекты. */
  public projects: Project[];

  /**Конверты. */
  public envelopes: Envelope[];

  /**Значения баланса периода. */
  public balanceValues: BalanceValue[];

  /**Дата начала (для формы редакции конверта. */
  public startDate: Date;
  
  /**Дата окончания (для формы редакции конверта. */
  public endDate: Date;
    
  constructor() { }

}
