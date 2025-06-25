import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './layout/layout';

@Component({
  selector: 'app-root',
  imports: [
    Layout
  ],
  template: '<app-layout/>',
})
export class App  {
  protected title = 'time-spent';

  constructor(private readonly translate: TranslateService) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
