import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmedPassword = control.get('confirmedPassword');
    if (!password || !confirmedPassword) return null;
    return password.value === confirmedPassword.value ? null : { passwordMismatch: true };
}