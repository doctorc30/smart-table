import {FormlyFieldConfig} from "@ngx-formly/core";
import {TemplateRef} from "@angular/core";
import {Observable} from "rxjs";

export enum DialogMode {
  details, edit, create
}

export class DialogData {
  mode: DialogMode;
  model: any;
  title: string;
  submitButtonText?: string;
  form: FormlyFieldConfig[];
  afterFormTemplate: TemplateRef<{ value: any }>;
  closeButtonText: string;
  submitFunc?: (data) => Observable<any>;
}
