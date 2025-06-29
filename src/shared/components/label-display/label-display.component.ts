import {Component, effect, input, Input, InputSignal} from '@angular/core';
import {ILabel} from '../../models/issue.model';

@Component({
  selector: 'shared-label-display',
  imports: [],
  templateUrl: './label-display.component.html',
  styleUrl: './label-display.component.less'
})
export class LabelDisplay {

  label: InputSignal<ILabel> = input.required();

  title: string;
  suffix: string;

  constructor() {
    effect(() => {
      const parts: string[] = this.label().title.split('::');
      this.title = parts[0];
      this.suffix = parts[1];
    });
  }

}
