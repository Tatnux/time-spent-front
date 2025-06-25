import {Pipe, PipeTransform} from '@angular/core';

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

  static parse(value: string): number {
    if (!value) return 0;

    const trimmed = value.trim().toLowerCase();

    const match: RegExpMatchArray = RegExp(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m?)?/).exec(trimmed);

    if (!match) return 0;

    const hours: number = parseInt(match[1] || '0', 10);
    const minutes: number = parseInt(match[2] || '0', 10);

    if(hours === 0 && (minutes !== 0 && !/m/.test(trimmed))) {
      return 0;
    }

    return hours * 3600 + minutes * 60;
  }
}
