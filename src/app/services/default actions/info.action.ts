import {Injectable} from "@angular/core";
import {Action, ActionContext} from "../../models/action.model";
import {RestService} from "../rest.service";
import {SmartTableDialogComponent} from "../../table-dialog/smart-table-dialog.component";
import {DialogData, DialogMode} from "../../models/dialog-data.model";
import {EMPTY} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class InfoAction extends Action {

  constructor(private dialog: MatDialog, private rest: RestService) {
    super();
  }

  action = (context: ActionContext) => {
    let getApi = context.options.details.apiOptions && context.options.details.apiOptions.api || context.options.rest.get;
    this.rest
      .get(getApi, {id: context.value.id})
      .subscribe(x => {
        x['id'] = context.value.id;
        this.dialog.open(SmartTableDialogComponent, {
          panelClass: 'default-dialog',
          data: <DialogData>{
            model: x,
            title: context.options.details.dialogOptions.title(context.value),
            form: context.options.details.dialogOptions.form,
            mode: DialogMode.details,
            afterFormTemplate: context.options.details.dialogOptions.afterFormTemplate,
            closeButtonText: context.options.details.dialogOptions.closeButtonText,
          },
        });
      });
    return EMPTY;
  };
  icon = 'assignment'
}
