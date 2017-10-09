import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  getDateFormated = function (date: Date) {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }

  getDateJson = function (date: Date) {
    return this.getDateFormated(date);
  }

  getCurrentDate = function () {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
  }

  getCurrentDateJson = function () {
    return this.getDateJson(this.getCurrentDate());
  }
}
