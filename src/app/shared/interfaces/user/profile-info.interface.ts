export interface GetProfileInfoResponse {
  user: UserDto;
  userSettings: UserSettingsDto;
}

export interface UserDto {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
}

export interface UserSettingsDto {
  avatarUrl?: string | null;
  currency: string;
  language: string;
  theme: Theme;
  emailNotify: boolean;
  showLastLogin: boolean;
}

export enum Theme { System = 'System', Light = 'Light', Dark = 'Dark' }
