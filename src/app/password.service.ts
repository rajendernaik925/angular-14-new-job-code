import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private storageKey = 'userData';

  constructor() { }

  private getUserData(): any | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      const decoded = decodeURIComponent(window.atob(raw));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
      return null;
    }
  }

  // ✅ Check if user is first login
  isFirstLogin(): boolean {
    const userData = this.getUserData();
    return userData?.user?.firstLogin === 1;
  }


  // ✅ Save userData (when you get fresh data from API)
  setUserData(data: any): void {
    try {
      const encoded = window.btoa(encodeURIComponent(JSON.stringify(data)));
      localStorage.setItem(this.storageKey, encoded);
    } catch (error) {
      console.error('Error saving userData to localStorage:', error);
    }
  }

  setFirstLoginToZero(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const decoded = decodeURIComponent(window.atob(raw));
      const userData = JSON.parse(decoded);

      userData.user.firstLogin = 0; // reset count

      const encoded = window.btoa(encodeURIComponent(JSON.stringify(userData)));
      localStorage.setItem(this.storageKey, encoded);
    } catch (error) {
      console.error('Error resetting firstLogin:', error);
    }
  }

}
