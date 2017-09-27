import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class ErrorService {

  constructor() { }

  getErrorMessage = function (obj: any) : string {
    let errorMessage = '';

    if (obj['IsError'] == true) {
        errorMessage = obj['ErrorMessage'];
    }

    if (!errorMessage && _.isString(obj)) {
        var n = obj.indexOf('<title>');
        if (n >= 0) {
            var n1 = obj.indexOf('</title>');
            if (n1 >= 0) {
                errorMessage = obj.substr(n + 7, n1 - n - 7);
            }
        } else {
          //Пытаемся преобразовать строку в Json.
          try {
            var json = JSON.parse(obj);
            errorMessage = this.getErrorMessage(json);
          } catch (err) {
            let a = 1;
          }
        }
    }

    return errorMessage;
  }
}
