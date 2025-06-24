import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'secondsToHours', standalone: true })
export class SecondsToHoursPipe implements PipeTransform {
  transform(value: number): string {
    return SecondsToHoursPipe.transform(value);
  }

  static transform(value: number, minuteShort: boolean = true): string {
    if (value === 0) return '0h';

    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);

    const hours = Math.floor(absValue / 3600);
    const minutes = Math.floor((absValue % 3600) / 60);

    const minuteUnit: string = minuteShort && hours > 0 ? '' : 'm';
    const minutePart: string = minutes > 0 ? `${minutes}${minuteUnit}` : '';
    const hourPart: string = hours > 0 || minutes === 0 ? `${hours}h` : '';

    return `${sign}${hourPart}${minutePart}`;
  }
}
