import {Injectable} from '@angular/core';
import {UrlBuilderService} from "./url-builder.service";
import {FilterOptions} from "../models/filter.model";
import {Observable} from "rxjs";
import {ListResult} from "../models/list-result.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable()
export class RestService {

  constructor(
    protected http: HttpClient,
    protected urlBuilder: UrlBuilderService,
    protected auth: AuthService) {
  }

  list(api: string, filter?: FilterOptions, params?: any): Observable<ListResult<any>> {
    let url = this.urlBuilder.build(api, params);
    let prms = this.urlBuilder.getFilterParams(filter);
    return this.http.get<any>(url, {
      headers: this.getHeaders(),
      params: prms
    });
  }

  get(api: string, params?: any): Observable<any> {
    let url = this.urlBuilder.build(api, params);
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    });
  }

  post(data, api: string, params?: any): Observable<any> {
    let url = this.urlBuilder.build(api, params);
    return this.http.post<any>(url, data, {
      headers: this.getHeaders(),
    });
  }

  patch(data, api: string, params?: any): Observable<any> {
    let url = this.urlBuilder.build(api, params);
    return this.http.patch<any>(url, data, {
      headers: this.getHeaders(),
    });
  }

  delete(api: string, params?: any): Observable<any> {
    let url = this.urlBuilder.build(api, params);
    return this.http.delete<any>(url, {
      headers: this.getHeaders(),
    });
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    console.log("RestService", this.auth["storageKey"]);
    if (this.auth.accessToken != null) {
      headers = headers.set('Authorization', 'bearer ' + this.auth.accessToken)
    }
    return headers;
  }
}
