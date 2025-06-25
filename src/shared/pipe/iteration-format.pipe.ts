import {Pipe, PipeTransform} from '@angular/core';
import {IIteration} from '../models/iteration.model';
import {formatDate} from '@angular/common';

@Pipe({ name: 'iterationFormat' })
export class IterationFormatPipe implements PipeTransform {
  transform(iteration: IIteration, title: boolean = true): string {
    return IterationFormatPipe.transform(iteration, true, title);
  }

  static transform(iteration: IIteration, year: boolean = true, title: boolean = true): string {
    if(title) {
      if(iteration.state === 'current') {
        return "Current Iteration";
      }
      if(iteration.state === 'upcoming') {
        return "Next Iteration";
      }
    }
    const start = new Date(iteration.startDate);
    const end = new Date(iteration.dueDate);
    return `${this.formatIterationDate(start, year && start.getFullYear() !== end.getFullYear())} - ${this.formatIterationDate(end, year)}`
  }

  private static formatIterationDate(date: Date, year: boolean = true): string {
    let format: string = 'MMM d'
    if(year) {
      format += ', yyyy';
    }
    return formatDate(date, format, 'en-US');
  }
}
