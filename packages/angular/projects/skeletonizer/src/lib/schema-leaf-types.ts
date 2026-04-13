import type { AbstractControl } from '@angular/forms';
import type { Signal } from '@angular/core';

declare module '@skeletonizer/utils' {
  interface ISchemaLeafTypes {
    angularAbstractControl: AbstractControl;
    angularSignal: Signal<unknown>;
  }
}
