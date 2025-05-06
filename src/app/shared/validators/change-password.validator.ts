import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const changePasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const currentPassword = control.get('currentPassword');
  const newPassword = control.get('newPassword');
  const confirmedPassword = control.get('confirmedPassword');
  if (!currentPassword || !newPassword || !confirmedPassword) return null;
  return Object.assign({}, currentPassword.value === newPassword.value && { passwordReused: true },
                           newPassword.value !== confirmedPassword.value && { passwordMismatch: true }) || null;
};