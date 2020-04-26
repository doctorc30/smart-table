import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActionColumn, Column} from "../models/column.model";
import {ActionOptions, SmartTableOptions} from "../models/table-options.model";
import {RestService} from "../services/rest.service";
import {Observable} from "rxjs";
import {FilterOptions} from "../models/filter.model";
import {FormControl} from "@angular/forms";
import {map, tap} from "rxjs/operators";
import {CreateAction} from "../services/default actions/create.action";
import {InfoAction} from "../services/default actions/info.action";
import {EditAction} from "../services/default actions/edit.action";
import {DeleteAction} from "../services/default actions/delete.action";

@Component({
  selector: 'smart-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.css']
})
export class TableComponent implements OnInit {

  @Input() columns: Column<any>[];
  @Input() options: SmartTableOptions;

  @ViewChild('actionsColumn') actionsColumn;

  rows: Observable<any>;
  filter: FilterOptions;

  filterFormControl = new FormControl();
  total: number;
  createActionOptions: ActionOptions;

  constructor(
    public createAction: CreateAction,
    public editAction: EditAction,
    public deleteAction: DeleteAction,
    public infoAction: InfoAction,
    protected crudService: RestService) {
    this.filterFormControl.valueChanges.subscribe(x => {
      this.filter.searchStr = x;
      this.updateRows();
    });
  }

  get hasCreate(): boolean {
    return this.options.create != null;
  }

  ngOnInit() {
    this.initCreateAction();
    this.initColumnsActions();
    this.initFilters();
    this.updateRows();
  }

  private initColumnsActions() {
    for (let a of [this.editAction, this.deleteAction, this.infoAction]) {
      a.afterActionFunc = this.updateRows.bind(this);
    }

    let actionColumn = this.columns.find(x => x.type == 'action') as ActionColumn<any>;
    if (actionColumn == null) {
      actionColumn = {
        actionsOptions: []
      };
      this.columns.push(actionColumn);
    }

    let actions: ActionOptions[] = [];
    if (this.options.details) {
      actions.push(this.options.details.actionOptions || {
        action: this.infoAction,
        icon: this.infoAction.icon
      });
    }
    if (this.options.delete) {
      actions.push(this.options.delete.actionOptions || {
        action: this.deleteAction,
        icon: this.deleteAction.icon
      });
    }
    if (this.options.edit) {
      actions.push(this.options.edit.actionOptions || {
        action: this.editAction,
        icon: this.editAction.icon
      });
    }
    actionColumn.actionsOptions = actions;
    actionColumn.template = this.actionsColumn;
  }

  private initCreateAction() {
    if (!this.hasCreate)
      return;

    if (this.options.create.actionOptions) {
      this.createActionOptions = this.options.create.actionOptions;
      if (!this.options.create.actionOptions.action)
        this.createActionOptions.action = this.createAction;
    } else {
      this.createActionOptions = {
        action: this.createAction,
        buttonText: this.createAction.buttonText
      };
    }

    this.createActionOptions.action.afterActionFunc = () => {
      this.initFilters();
      this.updateRows();
    };
  }

  private initFilters() {
    this.filter = {
      ...{
        take: 10,
        page: 0,
        desc: false
      },
      ...this.options.list.filterOptions
    };
  }

  updateRows() {
    let listApi = (this.options.list.apiOptions && this.options.list.apiOptions.api) || this.options.rest.list;
    this.rows = this.crudService
      .list(listApi, this.filter)
      .pipe(
        tap(r => this.total = r.total),
        map(r => r.items)
      );
  }

  onPage(pageInfo) {
    this.filter.page = pageInfo.offset;
    this.updateRows();
  }
}
