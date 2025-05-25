import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const changePasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const currentPassword = control.get('currentPassword')?.value;
  const newPassword = control.get('newPassword')?.value;
  const confirmedPassword = control.get('confirmedPassword')?.value;
  if (!currentPassword || !newPassword || !confirmedPassword) return null;
  return Object.assign({}, currentPassword === newPassword && { passwordReused: true }, newPassword !== confirmedPassword && { passwordMismatch: true }) || null;
};
