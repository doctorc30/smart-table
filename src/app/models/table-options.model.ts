import {FormlyFieldConfig} from "@ngx-formly/core";
import {TemplateRef} from "@angular/core";
import {FilterOptions} from "./filter.model";
import {RestApi} from "../services/rest-api";
import {Action} from "./action.model";

export interface DialogOptions {
  form: FormlyFieldConfig[],
  title: (value: any) => string;
  closeButtonText?: string;
  afterFormTemplate?: TemplateRef<{ value: any }>;
  submitButtonText?: string;
}

export interface ActionOptions {
  icon?: string;
  buttonText?: string;
  action?: Action;
}

export interface CrudOptions {
  apiOptions?: ApiOptions;
  dialogOptions?: DialogOptions;
  actionOptions?: ActionOptions;
}

export interface ListOptions {
  apiOptions?: ApiOptions;
  filterOptions?: FilterOptions
}

export interface ApiOptions{
  api?: string;
  params?: any;
}

export interface SmartTableOptions {
  rest: RestApi,
  list: ListOptions;
  details?: CrudOptions;
  create?: CrudOptions;
  delete?: CrudOptions;
  edit?: CrudOptions;
}
