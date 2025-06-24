import {Component} from '@angular/core';
import {TimeLogView} from './time-log-view/time-log-view';
import {TranslateService} from '@ngx-translate/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    TimeLogView,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App  {
  protected title = 'time-spent';

  constructor(private readonly translate: TranslateService) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
