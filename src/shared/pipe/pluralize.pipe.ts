import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'pluralize' })
export class PluralizePipe implements PipeTransform {
  transform(value: string, count: number): string {
    return value.replace('(s)', count > 1 ? 's' : '');
  }
}
