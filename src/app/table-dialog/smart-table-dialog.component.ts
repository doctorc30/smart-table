import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {DialogData} from "../models/dialog-data.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-table-dialog',
  templateUrl: 'smart-table-dialog.component.html',
  styleUrls: ['smart-table-dialog.component.css']
})
export class SmartTableDialogComponent implements OnInit {

  public form = new FormGroup({});
  public model: any = null;
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[];

  constructor(private dialogRef: MatDialogRef<SmartTableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.model = this.data.model;
    this.fields = this.data.form;
  }

  ngOnInit() {
  }

  close(res?: any, response?) {
    this.dialogRef.close({data: res, response: response});
  }

  submit() {
    this.data.submitFunc({...this.model, ...this.form.value}).subscribe(response => this.close(this.form.value, response));
  }
}
