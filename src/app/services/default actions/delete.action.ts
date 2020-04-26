import {Injectable} from "@angular/core";
import {Action, ActionContext} from "../../models/action.model";
import {RestService} from "../rest.service";
import {SmartTableDialogComponent} from "../../table-dialog/smart-table-dialog.component";
import {DialogData, DialogMode} from "../../models/dialog-data.model";
import {filter} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class DeleteAction extends Action {

  constructor(private dialog: MatDialog, private rest: RestService) {
    super();
  }

  icon = 'delete';
  action = (context: ActionContext) => {
    let deleteApi = context.options.delete.apiOptions && context.options.delete.apiOptions.api || context.options.rest.delete;
    let dialogRef = this.dialog.open(SmartTableDialogComponent, {
      panelClass: 'smart-table-delete-dialog',
      data: <DialogData>{
        model: null,
        mode: DialogMode.create,
        submitButtonText: "Да",
        closeButtonText: "Нет",
        title: `Удалить элемент № ${context.value.id}?`,
        submitFunc: (model) => this.rest.delete(deleteApi, {id: context.value.id})
      }
    });
    return dialogRef
      .afterClosed()
      .pipe(
        filter(res => res)
      );
  }
}
