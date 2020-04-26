import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Column} from "../models/column.model";

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css']
})
export class CrudTableComponent implements OnInit {

  /*Paging*/
  @Input() externalPaging: boolean;
  @Input() limit: boolean;
  @Input() offset: boolean;
  @Input() count: boolean;

  @Input() class: any;
  @Input() rows: any;
  @Input() columns: Column<any>[];
  @Output() onPage: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  getView(val, col: Column<any>) {
    return col.key && val[col.key] || col.viewProvider && col.viewProvider(val);
  }

  getContext(val, col: Column<any>) {
    return {value: val, column: col};
  }

}
