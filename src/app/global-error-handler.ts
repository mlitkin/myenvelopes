import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DialogService } from './services/dialog.service';
import { ErrorService } from './services/error.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super(true);
   }

  handleError(error) {
    //Получаем текст ошибки.
    const errorService = this.injector.get(ErrorService);
    var message = errorService.getErrorMessage(error.error);
    if (!message) {
      message = error.message ? error.message : error.toString();
    }

    var textEl = document.getElementById("errorOverlayText")
    textEl.innerText = message;

    //Отображаем окно с ошибкой.
    var el = document.getElementById("errorOverlay");
    el.style.visibility = "visible";

     super.handleError(error);
  }  
}