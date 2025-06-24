import { Pipe, PipeTransform } from '@angular/core';
import {TitleCasePipe} from '@angular/common';

@Pipe({ name: 'username', standalone: true })
export class UsernamePipe implements PipeTransform {

  private static readonly titleCase: TitleCasePipe = new TitleCasePipe();

  transform(value: string): string {
    return UsernamePipe.transform(value);
  }

  static transform(value: string): string {
    if(value.includes('.') || value.includes('@')) {
      value = value.split('@')[0];
      return value.split('.').map(this.titleCase.transform).join(' ');
    }
    return value;
  }
}
