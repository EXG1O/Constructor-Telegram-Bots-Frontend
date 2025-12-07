export class JWTStorage {
  static getRefreshToken(): string | null {
    return window.localStorage.getItem('refreshToken');
  }

  static getAccessToken(): string | null {
    return window.localStorage.getItem('accessToken');
  }

  static setRefreshToken(value: string): void {
    window.localStorage.setItem('refreshToken', value);
  }

  static setAccessToken(value: string): void {
    window.localStorage.setItem('accessToken', value);
  }

  static removeRefreshToken(): void {
    window.localStorage.removeItem('refreshToken');
  }

  static removeAccessToken(): void {
    window.localStorage.removeItem('accessToken');
  }

  static clearTokens(): void {
    this.removeRefreshToken();
    this.removeAccessToken();
  }
}
