import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const resetPasswordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmedPassword = control.get('confirmedPassword');
    if (!newPassword || !confirmedPassword) return null;
    return newPassword.value === confirmedPassword.value ? null : { passwordMismatch: true };
}