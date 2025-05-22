import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const resetPasswordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmedPassword = control.get('confirmedPassword')?.value;
    return newPassword && confirmedPassword && newPassword !== confirmedPassword ? { passwordMismatch: true } : null;
}