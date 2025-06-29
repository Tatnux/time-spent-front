import {Injectable} from '@angular/core';
import { Subscription } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private readonly subscription: Subscription = new Subscription();

  readonly publicHoliday: Map<string, string> = new Map<string, string>();

  constructor(http: HttpClient) {
    this.subscription.add(http.get<{[key: string]: string}>('https://calendrier.api.gouv.fr/jours-feries/metropole.json').subscribe({
      next: (response: { [key: string]: string }) => {
        Object.entries(response).forEach(([date, name]: [string, string]) => this.publicHoliday.set(date, name));
      }
    }))
  }

  public getPublicHoliday(date: Date | string): string | undefined{
    const dateKey: string = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return this.publicHoliday.get(dateKey)
  }
}
