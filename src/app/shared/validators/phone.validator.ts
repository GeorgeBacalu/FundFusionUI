import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isValidPhoneNumber } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/metadata.full.json';

export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const phone = control.get('phone')?.value;
  const code = control.get('countryPhoneData')?.value?.code;
  return phone && code && !isValidPhoneNumber(phone, code, metadata) ? { invalidPhone: true } : null;
}
