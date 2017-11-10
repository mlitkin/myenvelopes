import { Directive, OnInit, ElementRef, HostListener } from '@angular/core';
import { MoneyPipe } from '../pipes/money.pipe';

@Directive({
  selector: '[money]'
})
export class MoneyDirective implements OnInit {
  private el: HTMLInputElement;
  constructor(
    private elementRef: ElementRef,
    private moneyPipe: MoneyPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    if (this.el.value) {
      this.el.value = this.moneyPipe.transform(this.el.value);
    }
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    //this.el.value = this.moneyPipe.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    //this.el.value = this.moneyPipe.transform(value);
  }
}
