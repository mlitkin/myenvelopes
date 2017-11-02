import { Component, OnInit, Input } from '@angular/core';
import { BalanceValue } from '../view-models/balance-value';

@Component({
  selector: 'balance-value',
  templateUrl: './balance-value.component.html',
  styleUrls: ['./balance-value.component.css']
})
export class BalanceValueComponent implements OnInit {
  @Input() 
  data: BalanceValue;

  @Input() 
  balanceValuesInHeader: BalanceValue[];

  @Input() 
  canExpand: boolean = true;

  expanded: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    if (!this.canExpand) {
      return;
    }

    this.expanded = !this.expanded;
  }

  onChecked() {
    var elemInHeaderIndex = this.balanceValuesInHeader.findIndex(x => x.valueType == this.data.valueType);

    if (this.data.showInHeader && elemInHeaderIndex < 0) {
      this.balanceValuesInHeader.push(this.data);
      return;
    }

    if (elemInHeaderIndex >= 0) {
      this.balanceValuesInHeader.splice(elemInHeaderIndex, 1);
    }
  }
}
