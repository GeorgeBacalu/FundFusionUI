// Validation
export const passwordMismatch = "Passwords don't match";
export const passwordReused = "New password must differ from current password";
export const invalidResetLink = "This password reset link is invalid";
export const resetLinkExpiredOrUsed = "This reset link has expired or already been used";
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S{6,}$/;

// Errors
export const accountNotFound = "No account found with this email";
export const invalidCredentials = "Incorrect email or password";
export const genericError = "Something went wrong";

export const countryNotFound = "Country not found";
export const stateNotFound = "State not found";

export const registrationFailed = "Registration failed";
export const loginFailed = "Login failed";
export const passwordChangeFailed = "Password change failed";
export const passwordResetEmailFailed = "Failed to send password reset email";
export const passwordResetFailed = "Password reset failed";
export const accountDeactivationFailed = "Account deactivation failed";
export const profileLoadFailed = "Failed to load profile data";
export const profileUpdateFailed = "Failed to update profile data";
export const avatarUploadFailed = "Failed to upload avatar";
export const avatarRemoveFailed = "Failed to remove avatar";
export const failedToSaveCategory = "Failed to save category";
export const failedToSoftDeleteCategory = "Failed to move category to recycle bin";
export const failedToRestoreCategory = "Failed to restore category";
export const failedToHardDeleteCategory = "Failed to delete category";
export const failedToResetCategories = "Failed to reset categories";

export const profileImageTooLarge = "The selected profile image exceeds the 20MB upload limit";
export const categoryImageTooLarge = "The selected category image exceeds the 5MB upload limit";
export const fileTooLarge = "Request body too large";

// Suuccess
export const userRegisteredSuccessfully = "User registered successfully";
export const userLoggedInSuccessfully = "User logged in successfully";
export const userLoggedOutSuccessfully = "User logged out successfully";

// API
export const apiAuth = "api/auth";
export const apiLocation = "api/locations";
export const apiUser = "api/users";
export const apiCategory = "api/categories";

// Utils
export const isPayloadTooLarge = (error: any): boolean => error?.errors?.['']?.[0]?.includes(fileTooLarge);
