export interface GetProfileDataResponse {
  user: UserDto;
  userSettings: UserSettingsDto;
}

export interface UpdateProfileRequest {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  currency?: string | null;
  language?: string | null;
  theme?: number | null;
  emailNotify?: boolean | null;
  showLastLogin?: boolean | null;
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
