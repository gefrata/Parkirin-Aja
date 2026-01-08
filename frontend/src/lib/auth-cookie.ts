export function setAuthCookie(user: any) {
    document.cookie = `auth_user=${encodeURIComponent(
      JSON.stringify({
        email_verified_at: user.email_verified_at,
      })
    )}; path=/; max-age=86400`;
  }
  
  export function clearAuthCookie() {
    document.cookie = 'auth_user=; path=/; max-age=0';
  }