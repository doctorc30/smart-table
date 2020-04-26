import {NgModule} from '@angular/core';
import {CrudTableComponent} from './crud-table/crud-table.component';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {TableComponent} from './table/table.component';
import {SmartTableDialogComponent} from './table-dialog/smart-table-dialog.component';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {RestService} from "./services/rest.service";
import {CreateAction} from "./services/default actions/create.action";
import {InfoAction} from "./services/default actions/info.action";
import {EditAction} from "./services/default actions/edit.action";
import {DeleteAction} from "./services/default actions/delete.action";
import {FormlyModule} from '@ngx-formly/core';
import {
  emailValidation,
  emailValidationMessage,
  maxValidationMessage,
  passwordValidation,
  passwordValidationMessage
} from "./validators/formly.validator";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";

export const formlyConf = {
  validators: [
    {name: 'email', validation: emailValidation},
    {name: 'password', validation: passwordValidation}
  ],
  validationMessages: [
    {name: 'required', message: 'Обязательно для заполнения'},
    {name: 'max', message: maxValidationMessage},
    {name: 'email', message: emailValidationMessage},
    {name: 'password', message: passwordValidationMessage},
  ]
};

@NgModule({
  imports: [
    CommonModule,
    FormlyModule.forRoot(formlyConf),
    MatNativeDateModule,
    NgxDatatableModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [CrudTableComponent, TableComponent, SmartTableDialogComponent],
  exports: [CrudTableComponent, TableComponent, SmartTableDialogComponent],
  bootstrap: [SmartTableDialogComponent],
  providers: [
    CreateAction,
    DeleteAction,
    InfoAction,
    EditAction,
    RestService
  ]
})
export class SmartTableModule {
}
