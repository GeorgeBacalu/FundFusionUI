export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S{6,}$/; // Rules: +1 digit, +1 lowercase letter, +1 uppercase letter, +1 special character, +6 chars, no whitespace

export const passwordReused = "New password must differ from current";
export const passwordMismatch = "Passwords don't match";

export const userRegisteredSuccessfully = "User registered successfully";
export const userLoggedInSuccessfully = "User logged in successfully";
export const userLoggedOutSuccessfully = "User logged out successfully";
export const passwordChangedSuccessfully = "Password changed successfully. Please log in again.";

export const accountNotFound = 'No account found with this email';
export const invalidCredentials = 'Incorrect email or password';
export const genericError = 'Something went wrong';

export const invalidPasswordResetLink = "This password reset link is invalid";
export const resetLinkExpiredOrUsed = "This reset link has expired or has already been used";

export const apiAuth = "api/auth";