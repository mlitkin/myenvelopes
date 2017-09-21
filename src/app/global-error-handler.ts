import { ErrorHandler, Injectable } from '@angular/core';
import { DialogService } from './services/dialog.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor() {
    super(true);
   }

  handleError(error) {
     //Обработчик тут.
    alert(1);
    var el = document.getElementById("errorOverlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

     super.handleError(error);
  }  
}