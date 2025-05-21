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

export interface PhoneInfoResponse {
  displayName: string;
  prefix: string;
  length: number;
}