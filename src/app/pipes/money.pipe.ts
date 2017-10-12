import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: any, args?: any): any {
    return this.decimalPipe.transform(value, '1.0-2');
  }
}
