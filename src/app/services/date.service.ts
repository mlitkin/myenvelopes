import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  getDateFormated(date: any): string {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }

  getDateJson(date: Date | string): string {
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

  getDaysBetweenDates(startDate: Date, endDate: Date): number {
    startDate = this.getDateObject(startDate);
    endDate = this.getDateObject(endDate);

    return Math.floor((endDate.getTime() - startDate.getTime()) / 24 / 60 / 60 / 1000) + 1;
  }

  getUniqueIdByDate() {
    return (new Date()).getTime().toString();
  }
}
