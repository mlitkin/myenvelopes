import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  getDateFormated(date: Date): string {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }

  getDateJson(date: Date): string {
    return this.getDateFormated(date);
  }

  getCurrentDate(): Date {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
  }

  getCurrentDateJson(): string {
    return this.getDateJson(this.getCurrentDate());
  }

  getDateObject(dt: any): Date {
    if ((typeof dt) == 'object') {
      return dt;
    }

    var res = new Date(dt);
    res.setHours(0, 0, 0, 0);

    return res;
  }
}
