import {Injectable} from "@angular/core";
import {Action, ActionContext} from "../../models/action.model";
import {RestService} from "../rest.service";
import {SmartTableDialogComponent} from "../../table-dialog/smart-table-dialog.component";
import {DialogData, DialogMode} from "../../models/dialog-data.model";
import {filter} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class CreateAction extends Action {

  constructor(private dialog: MatDialog, private rest: RestService) {
    super();
  }

  buttonText = "Добавить";
  action = (context: ActionContext) => {
    let addApi = context.options.create.apiOptions && context.options.create.apiOptions.api || context.options.rest.add;
    let dialogRef = this.dialog.open(SmartTableDialogComponent, {
      panelClass: 'default-dialog',
      data: <DialogData>{
        model: null,
        title: context.options.create.dialogOptions.title(context.value),
        form: context.options.create.dialogOptions.form,
        mode: DialogMode.create,
        afterFormTemplate: context.options.create.dialogOptions.afterFormTemplate,
        closeButtonText: context.options.create.dialogOptions.closeButtonText,
        submitButtonText: context.options.create.dialogOptions.submitButtonText,
        submitFunc: (model) => this.rest.post(model, addApi, context.options.create.apiOptions && context.options.create.apiOptions.params),
      },
    });
    return dialogRef
      .afterClosed()
      .pipe(
        filter(res => res)
      );
  };
}
