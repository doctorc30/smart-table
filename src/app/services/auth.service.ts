import {Inject, Injectable, InjectionToken, Optional} from "@angular/core";
import {BehaviorSubject, combineLatest, interval, Observable, of, Subscription} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {filter, map, switchMap, tap, withLatestFrom} from "rxjs/operators";
import * as jwtDecode from 'jwt-decode';
import {Router} from "@angular/router";
import {AuthTokenModel} from "../models/auth/auth-tokens-model";
import {ProfileModel} from "../models/auth/profile-model";
import {LoginModel} from "../models/auth/login-model";
import {RefreshGrantModel} from "../models/auth/refresh-grant-model";
import {environment} from "../../environments/environment";

export const AUTH_STORAGE_KEY = new InjectionToken<string>('storageKey');
export const LOGIN_URL = new InjectionToken<string>('loginUrl');

export function retrieveTokens(storageKey): AuthTokenModel {
  const tokensString = localStorage.getItem(storageKey);
  const tokensModel: AuthTokenModel = tokensString == null ? null : JSON.parse(tokensString);
  return tokensModel;
}

@Injectable()
export class AuthService {


  private infoApi = 'api/user/info';
  private tokenApi = 'token';
  private readonly storageKey: string;
  private refreshSubscription$: Subscription;
  private _info$: BehaviorSubject<{ name: string; scope: string }>;
  private _profile$: BehaviorSubject<ProfileModel>;
  private _tokens$: BehaviorSubject<AuthTokenModel>;
  public loggedIn$: Observable<boolean>;

  public get accessToken() {
    return this._tokens$.getValue().access_token;
  }

  public get info$(): Observable<{ name: string; scope: string }> {
    return this._info$.pipe(filter(x => x != null));
  }

  get profile$(): Observable<ProfileModel> {
    return this._profile$.pipe(filter(x => x != null));
  }

  get tokens$(): Observable<AuthTokenModel> {
    return this._tokens$.pipe(filter(x => x != null));
  }

  constructor(private http: HttpClient,
              @Inject(AUTH_STORAGE_KEY) storageKey: string,
              @Optional() private router?: Router,
              @Optional() @Inject(LOGIN_URL) private loginUrl?: string) {
    this.storageKey = storageKey;
    this._tokens$ = new BehaviorSubject<AuthTokenModel>(null);
    this._profile$ = new BehaviorSubject<ProfileModel>(null);
    this._info$ = new BehaviorSubject<{ name: string; scope: string }>(null);
    this.loggedIn$ = this._tokens$.pipe(filter(x => x != null), map(tokens => !!tokens));

    this.startupTokenRefresh(this.storageKey)
      .subscribe();
  }

  login(user: LoginModel, api: string = this.tokenApi): Observable<any> {
    console.log("login", this.storageKey);
    return this.getTokens(user, 'password', api)
      .pipe(
        tap(() => this.scheduleRefresh())
      );
  }

  logout(): void {
    this._tokens$.next(null);
    this._profile$.next(null);
    if (this.refreshSubscription$) {
      this.refreshSubscription$.unsubscribe();
    }
    this.removeToken();
    if (this.loginUrl && this.router)
      this.router.navigate([this.loginUrl]);
  }

  public static storeToken(tokens: AuthTokenModel, storageKey): void {
    const previousTokens = retrieveTokens(storageKey);
    if (previousTokens != null && tokens.refresh_token == null) {
      tokens.refresh_token = previousTokens.refresh_token;
    }

    localStorage.setItem(storageKey, JSON.stringify(tokens));
  }

  private removeToken(): void {
    localStorage.removeItem(this.storageKey);
  }

  //todo add api
  private getTokens(data: RefreshGrantModel | LoginModel, grantType: string, api: string = this.tokenApi): Observable<AuthTokenModel> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    let reqData = {...data, ...{grant_type: grantType, scope: 'openid offline_access'}};
    let params = new HttpParams();
    Object.keys(reqData).forEach(key => params = params.append(key, reqData[key]));
    return this.http.post<AuthTokenModel>(/*environment.api +*/ api, params.toString(), {headers: headers})
      .pipe(
        tap(t => {
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'bearer ' + t.access_token);
          let sub = this.http
            .get<any>(/*environment.api +*/ this.infoApi, {headers: headers})
            .subscribe(i => {
              this._info$.next(i);
              sub.unsubscribe();
            });
        }),
        tap(res => {
          const tokens: AuthTokenModel = res;
          const now = new Date();
          tokens.expiration_date = new Date(now.getTime() + tokens.expires_in * 1000).getTime().toString();
          this.updateState(tokens);
        })
      );
  }

  private updateState(token: AuthTokenModel): void {
    const previousState = this._tokens$.getValue();
    const profile: ProfileModel = jwtDecode(token.id_token);
    token = {...previousState, ...token};
    AuthService.storeToken(token, this.storageKey);
    this._tokens$.next(token);
    this._profile$.next(profile);
  }

  public startupTokenRefresh(storageKey): Observable<AuthTokenModel> {
    return of(retrieveTokens(storageKey))
      .pipe(
        filter(x => x != null),
        tap((tokens: AuthTokenModel) => {
          this.updateState(tokens);
        }),
        withLatestFrom(this._tokens$),
        switchMap(([retrieveTokens, tokens]) => this.getTokens({refresh_token: tokens.refresh_token}, 'refresh_token')),
        tap(() => this.scheduleRefresh())
      );
  }

  private scheduleRefresh(): void {
    this.refreshSubscription$ = combineLatest(this._tokens$)
      .pipe(
        filter(([x]) => x != null),
        switchMap(([tokens]) => interval(tokens.expires_in / 2 * 1000), ([tokens]) => tokens),
        switchMap(tokens => this.getTokens({refresh_token: tokens.refresh_token}, 'refresh_token'))
      )
      .subscribe();
  }
}
