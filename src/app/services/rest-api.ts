export class RestApi {

  private readonly _baseApi: string;
  private readonly _baseApiWithId: string;

  get get(): string {
    return this._baseApiWithId;
  }

  get delete(): string {
    return this._baseApiWithId;
  }

  get list(): string {
    return this._baseApi;
  }

  get add(): string {
    return this._baseApi;
  }

  get update(): string {
    return this._baseApiWithId;
  }

  constructor(private envi: string, private prefix: string, private api: string, private readonly idParam: string = '$id') {
    if (this.idParam == null)
      this.idParam = '$id';
    this._baseApiWithId = `${this.envi}${this.prefix}/${this.api}/${this.idParam}`;
    this._baseApi = `${this.envi}${this.prefix}/${this.api}`;
  }
}
