import { FormGroup,FormControl } from '@angular/forms';

export class ValidationService {
    /**
     * 密碼格式確認
     * @param control 
     */
    static passwordValidator(control): { [key: string]: any } {
        // RFC 2822 compliant regex
        if (control.value.match(/^[a-zA-Z0-9]{6,12}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
    /**
     * 輸入新舊密碼是否一樣
     */
    static checkPasswords(oldPasswordKey: string, newPasswordKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let oldPassword = group.controls[oldPasswordKey];
            let newPassword = group.controls[newPasswordKey];

            if (oldPassword.value == newPassword.value) {
                return {
                    samePasswords: true
                };
            }
        }
    }
    /**
     * 輸入2次新密碼確認是否一致
     */
    static matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }
}
