export interface Country {
  id: string;
  name: string;
  code: string;
  prefix: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
}

export interface CountryPhoneInfoResponse {
  label: string;
  code: string;
  prefix: string;
  length: number;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
}

export interface Locale {
  id: string;
  code: string;
  name: string;
}
