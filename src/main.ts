import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import {SmartTableModule} from "./app/smart-table.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SmartTableModule)
  .catch(err => console.error(err));
