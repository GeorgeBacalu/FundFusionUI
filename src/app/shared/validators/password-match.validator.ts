import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmedPassword = control.get('confirmedPassword')?.value;
    return password && confirmedPassword && password !== confirmedPassword ? { passwordMismatch: true } : null;
}