import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }

  showError(message: string, title: string) {
    let dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: { message: message, title: title }
    });
  }
}
