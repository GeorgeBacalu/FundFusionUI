export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S{6,}$/;

export const passwordMismatch = "Passwords don't match";
export const passwordReused = "New password must differ from current";

export const accountNotFound = "No account found with this email";
export const invalidCredentials = "Incorrect email or password";
export const genericError = "Something went wrong";

export const registrationFailed = "Registration failed";
export const loginFailed = "Login failed";
export const passwordChangeFailed = "Password change failed";
export const passwordResetFailed = "Password reset failed";
export const accountDeactivationFailed = "Account deactivation failed";
export const profileLoadFailed = "Failed to load profile data";
export const profileUpdateFailed = "Failed to update profile data";
export const avatarUploadFailed = "Failed to upload avatar";
export const avatarRemoveFailed = "Failed to remove avatar";

export const payloadTooLarge = "Request body too large";
export const fileTooLarge = "The selected file exceeds the 20MB upload limit";

export const invalidResetLink = "This password reset link is invalid";
export const resetLinkExpiredOrUsed = "This reset link has expired or has already been used";

export const countryNotFound = "Country not found";
export const stateNotFound = "State not found";

export const userRegisteredSuccessfully = "User registered successfully";
export const userLoggedInSuccessfully = "User logged in successfully";
export const userLoggedOutSuccessfully = "User logged out successfully";
export const passwordChangedSuccessfully = "Password changed successfully. Please log in again";

export const apiAuth = "api/auth";
export const apiLocation = "api/locations";
export const apiUser = "api/users";
