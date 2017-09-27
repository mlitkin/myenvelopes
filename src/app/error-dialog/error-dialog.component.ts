import { Component, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {

  constructor(
    public dialogRef: MdDialogRef<ErrorDialogComponent>,
    @Inject(MD_DIALOG_DATA) 
    public data: any) { 
    }
}
