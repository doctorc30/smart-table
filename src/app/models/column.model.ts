import {TemplateRef} from "@angular/core";
import {Action} from "./action.model";
import {ActionOptions} from "./table-options.model";

export interface Column<T> {
  flexGrow?: number;
  name?: string;
  maxWidth?: number;
  class?: string;
  template?: TemplateRef<{ value: T, column: Column<T> }>;
  viewProvider?: (value: T) => any;
  key?: string;
  type?: string;
  options?: any;
}

export interface ActionColumn<T> extends Column<T> {
  actionsOptions: ActionOptions[];
}
