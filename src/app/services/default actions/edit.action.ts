import {Injectable} from "@angular/core";
import {Action, ActionContext} from "../../models/action.model";
import {RestService} from "../rest.service";
import {SmartTableDialogComponent} from "../../table-dialog/smart-table-dialog.component";
import {DialogData, DialogMode} from "../../models/dialog-data.model";
import {filter, switchMap} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class EditAction extends Action {
  constructor(private dialog: MatDialog, private rest: RestService) {
    super();
  }

  action = (context: ActionContext) => {
    let getApi = context.options.edit.apiOptions && context.options.edit.apiOptions.api || context.options.rest.get;
    let editApi = context.options.edit.apiOptions && context.options.edit.apiOptions.api || context.options.rest.update;
    return this.rest
      .get(getApi, {id: context.value.id})
      .pipe(
        switchMap(x => {
          let dialogRef = this.dialog.open(SmartTableDialogComponent, {
            panelClass: 'default-dialog',
            data: <DialogData>{
              model: x,
              title: context.options.edit.dialogOptions.title(context.value),
              form: context.options.edit.dialogOptions.form,
              mode: DialogMode.edit,
              afterFormTemplate: context.options.edit.dialogOptions.afterFormTemplate,
              closeButtonText: context.options.edit.dialogOptions.closeButtonText,
              submitButtonText: context.options.edit.dialogOptions.submitButtonText || 'Сохранить',
              submitFunc: (model) => this.rest.patch(model, editApi, {id: context.value.id}),
            },
          });
          return dialogRef
            .afterClosed()
            .pipe(
              filter(res => res)
            );
        })
      );
  };
  icon = 'edit'
}
