import { UserRole } from '../contexts/AuthContext';

/**
 * Determines user role based on email/phone
 * Emails ending with @admin.com get admin role
 * All others get user role
 */
export function determineUserRole(emailOrPhone: string): UserRole {
  // Check if it's an email (contains @)
  if (emailOrPhone.includes('@')) {
    // Admin emails end with @admin.com
    if (emailOrPhone.toLowerCase().endsWith('@admin.com')) {
      return 'admin';
    }
  }
  
  // Default to user role
  return 'user';
}

/**
 * Check if user has admin role
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  return role === 'admin' ? 'Administrator' : 'Shop Owner';
}
