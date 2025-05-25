import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const phone = control.get('phone')?.value;
  const code = control.get('countryPhoneInfo')?.value?.code;
  return phone && code && !parsePhoneNumberFromString(phone, code)?.isValid() ? { invalidPhone: true } : null;
}
