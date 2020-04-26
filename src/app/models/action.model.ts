import {SmartTableOptions} from "./table-options.model";
import {Observable} from "rxjs";

export class Action {

  constructor(action?: (context: ActionContext) => Observable<any>, afterActionFunc?: (v?, r?) => void) {
    this.action = action;
    this.afterActionFunc = afterActionFunc;
  }

  action?: (context: ActionContext) => Observable<any>;
  afterActionFunc?: (v?, r?) => void;

  public invoke(context: ActionContext) {
    let sub = this.action(context)
      .subscribe(x => {
        this.afterActionFunc(context.value, x);
        sub.unsubscribe();
      });
  }
}

export class ActionContext {
  value: any;
  column: any;
  options: SmartTableOptions;
}
