import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {environment} from '../../environments/environment';

@Directive({
  selector: '[appDev]'
})
export class Dev {

  constructor(private readonly vcr: ViewContainerRef,
              private readonly templateRef: TemplateRef<any>) {
    if(environment.hostname !== 'localhost') {
      return;
    }

    this.vcr.createEmbeddedView(this.templateRef);
  }

}
