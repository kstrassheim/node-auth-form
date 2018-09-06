import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[appValidateEqual][formControlName],[appValidateEqual][formControl],[appValidateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator implements Validator {
    constructor( @Attribute('appValidateEqual') public validateEqual: string) {  }
    validate(control: AbstractControl): { [key: string]: any } {
        const v = control.value, e = control.root.get(this.validateEqual);
        if (e && v !== e.value) { return {validateEqual: true}; }
        return null;
    }
}
