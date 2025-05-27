export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S{6,}$/;

export const passwordMismatch = "Passwords don't match";
export const passwordReused = "New password must differ from current";

export const registrationFailed = "Registration failed";
export const loginFailed = "Login failed";
export const passwordChangeFailed = "Password change failed";
export const passwordResetFailed = "Password reset failed";
export const accountDeactivationFailed = "Account deactivation failed";

export const accountNotFound = "No account found with this email";
export const invalidCredentials = "Incorrect email or password";
export const genericError = "Something went wrong";

export const invalidResetLink = "This password reset link is invalid";
export const resetLinkExpiredOrUsed = "This reset link has expired or has already been used";

export const userRegisteredSuccessfully = "User registered successfully";
export const userLoggedInSuccessfully = "User logged in successfully";
export const userLoggedOutSuccessfully = "User logged out successfully";
export const passwordChangedSuccessfully = "Password changed successfully. Please log in again";

export const apiAuth = "api/auth";
export const apiLocation = "api/locations";
