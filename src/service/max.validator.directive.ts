import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[max][formControlName],[max][formControl],[max][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxValidator), multi: true }
    ]
})
export class MaxValidator implements Validator {
    constructor( @Attribute('max') public _max: any) {

    }

    validate(c: AbstractControl): { [key: string]: any } {
      
        let pattern = /^\+?[1-9][0-9]*$/;
        if (!pattern.test(c.value)) {
            return {
                validateEqual: false
            };
        }
        let value = parseInt(c.value);
        // console.log(this._max);
        let max = parseInt(this._max);

        // console.log("max");
        // console.log(this._max);
        // console.log("value");
        // console.log(value);

        if (value >= 0 && max >= 0 && value <= max) {
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