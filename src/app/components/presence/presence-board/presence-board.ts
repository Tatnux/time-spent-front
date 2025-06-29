import { Component } from '@angular/core';
import {PresenceCalendar} from '../presence-calendar/presence-calendar';

@Component({
  selector: 'app-presence-board',
  imports: [
    PresenceCalendar
  ],
  templateUrl: './presence-board.html',
  styleUrl: './presence-board.less'
})
export class PresenceBoard {

}
