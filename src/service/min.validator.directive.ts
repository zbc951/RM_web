import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[min][formControlName],[min][formControl],[min][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MinValidator), multi: true }
    ]
})
export class MinValidator implements Validator {
    constructor( @Attribute('min') public _min: string) {

    }

    validate(c: AbstractControl): { [key: string]: any } {
      
        let pattern = /^\+?[1-9][0-9]*$/;

        if (!pattern.test(c.value)) {
            return {
                validateEqual: false
            };
        }
        let value = parseInt(c.value);
        let min = parseInt(this._min);

        if (value >= 0 && min >= 0 && value >= min) {
            return null;
        }
        return {
            validateEqual: false
        };
    }
}

// https://github.com/yuyang041060120/ng2-validation
// https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2
// https://jeffwu85182.github.io/2016/09/27/angular2-form-template-driven/