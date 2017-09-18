import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DialogService } from './services/dialog.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super(true);
   }

  handleError(error) {
     //Обработчик тут.
    alert(1);
    const dialogService = this.injector.get(DialogService);
    dialogService.showError('Текст ошибки', 'Заголовок');

     super.handleError(error);
  }  
}