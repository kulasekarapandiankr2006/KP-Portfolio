export interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

const AUTH_KEY = 'kp_admin_auth_session_v1';
const CREDS_KEY = 'kp_admin_credentials_v1';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

export const authService = {
  getStoredCredentials() {
    try {
      const stored = localStorage.getItem(CREDS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse admin credentials from localStorage', e);
    }
    return DEFAULT_CREDENTIALS;
  },

  updateCredentials(username: string, password: string):boolean {
    try {
      localStorage.setItem(CREDS_KEY, JSON.stringify({ username, password }));
      return true;
    } catch (e) {
      console.error('Failed to update credentials', e);
      return false;
    }
  },

  login(username: string, password: string):Promise<{ success: boolean; message?: string; user?: AdminUser }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const creds = this.getStoredCredentials();
        if (username.trim() === creds.username && password === creds.password) {
          const user: AdminUser = {
            username: creds.username,
            role: 'Lead Mechatronics Administrator',
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
          resolve({ success: true, user });
        } else {
          resolve({ 
            success: false, 
            message: 'Invalid administrator credentials. Default local login: admin / password123' 
          });
        }
      }, 350);
    });
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser(): AdminUser | null {
    try {
      const session = localStorage.getItem(AUTH_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.error('Error reading auth session', e);
    }
    return null;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
};
