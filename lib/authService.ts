
const AUTH_USER_KEY = 'hopeSchoolHubUser';
const PROFILE_PIC_URL_KEY = 'hopeSchoolHubUserProfilePic';

// For demonstration: hardcoded credentials.
// In a real application, NEVER do this. Use a secure backend authentication system.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminpassword';

export const loginUser = (username: string, password_unused: string): boolean => {
  if (typeof window === 'undefined') return false;
  // Use the provided password parameter, not password_unused
  if (username.toLowerCase() === ADMIN_USERNAME && password_unused === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_USER_KEY, ADMIN_USERNAME); 
    return true;
  }
  return false;
};

export const loginAsGuest = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_USER_KEY, 'guest');
  localStorage.removeItem(PROFILE_PIC_URL_KEY); 
};

export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(PROFILE_PIC_URL_KEY);
};

export const getAuthState = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_USER_KEY) !== null;
};

export const getCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_USER_KEY);
};

export const isGuest = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_USER_KEY) === 'guest';
};

export const isAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_USER_KEY) === ADMIN_USERNAME;
};

export const updateUsername = (currentUsername: string, newUsername: string): boolean => {
  if (typeof window === 'undefined') return false;
  const storedUsername = localStorage.getItem(AUTH_USER_KEY);
  
  if (storedUsername && storedUsername.toLowerCase() === ADMIN_USERNAME && currentUsername.toLowerCase() === ADMIN_USERNAME) {
    localStorage.setItem(AUTH_USER_KEY, newUsername);
    // If the new username is no longer "admin", we should probably also clear the "admin" specific profile pic.
    // For simplicity in this demo, we'll assume if the username changes from "admin", they are no longer "the admin"
    // and might want a different profile pic later if they changed it back to "admin".
    // However, a better approach for a real system would be role-based rather than username-based.
    if (newUsername.toLowerCase() !== ADMIN_USERNAME) {
        // If new username isn't "admin", consider them a different user or log them out
        // For this mock, we'll log them out if their username changes from "admin"
        // The settings form already handles logout on successful username change.
    }
    return true;
  }
  return false;
};

export const getProfilePicUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  if (isGuest()) return null; 
  return localStorage.getItem(PROFILE_PIC_URL_KEY);
};

export const updateProfilePicUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  if (isGuest()) return; 
  if (url) {
    localStorage.setItem(PROFILE_PIC_URL_KEY, url);
  } else {
    localStorage.removeItem(PROFILE_PIC_URL_KEY);
  }
};
