import {Injectable} from '@angular/core';
import {FilterOptions} from "../models/filter.model";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UrlBuilderService {

  public build(url: string, params?: { [p: string]: string | number }): string {
    if (params == null)
      return url;
    for (let p of Object.keys(params)) {
      url = url.replace("$" + p, params[p] + "")
    }
    return url;
  }

  public getFilterParams(filter: FilterOptions): HttpParams {
    let params = new HttpParams();

    if (filter == null)
      return params;

    for (let p of Object.keys(filter)) {
      if (filter[p] == null || p === 'desc')
        continue;

      let val = filter[p];

      if (p === 'orderByStr' && filter.desc)
        val += '.DESC';
      if (p === 'orderByStr' && !filter.desc)
        val += '.ASC';

      if (p === 'page')
        val += 1;

      params = params.set(p, val);
    }
    return params;
  }
}
