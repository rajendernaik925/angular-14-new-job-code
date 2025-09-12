import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private inactivityTime = 60 * 1000; // default: 1 minute
// private inactivityTime = 4 * 60 * 60 * 1000; // default: 4 hours
  private timeoutId: any;
  private intervalId: any; // for countdown timer
  private isAutoLogout = false; // flag to indicate real session timeout

  private localStorageKeysToRemove: string[] = [
    "userData",
    "loginData",
    "currentDate",
    "applction",
    "othrPrevlgs",
    "privileges",
    "newParams",
    "sessionExpiry"
  ];

  constructor(private router: Router, private ngZone: NgZone) {}

  /** Save session and set inactivity timer */
  saveUserSession(res: any, timeoutInSeconds: number = 60): void {
    const now = new Date().getTime();
    const expiryTime = now + timeoutInSeconds * 1000;

    localStorage.setItem('userData', window.btoa(encodeURIComponent(JSON.stringify(res))));
    localStorage.setItem('currentDate', window.btoa(encodeURIComponent(res.user.todaydate)));
    localStorage.setItem('sessionExpiry', expiryTime.toString());

    // Set inactivity timer dynamically
    this.setInactivityTime(timeoutInSeconds);
  }

  /** Clear session (only selected keys) */
  clearUserSession(): void {
    // Remove only specified keys
    this.localStorageKeysToRemove.forEach(key => localStorage.removeItem(key));

    // Stop any active timers
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.intervalId) clearInterval(this.intervalId);

    this.ngZone.run(() => {
      // Only show Swal if this is a real inactivity logout and not on login page
      if (this.isAutoLogout && !this.router.url.endsWith('/login')) {
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Session expired. Please log in again.',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        });
      } else {
        // If already on login page or not auto logout, just navigate
        this.router.navigate(['/login'], { replaceUrl: true });
      }

      // Reset the flag
      this.isAutoLogout = false;
    });
  }




  /** Set inactivity timer dynamically */
  setInactivityTime(seconds: number): void {
    this.inactivityTime = seconds * 1000;
    this.setupInactivityWatcher();
  }

  /** Watch for user activity and reset timer */
  private setupInactivityWatcher(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, () => this.resetTimer()));
    this.resetTimer();
  }

  /** Reset inactivity timer */
  private resetTimer(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.intervalId) clearInterval(this.intervalId);

    const remaining = this.inactivityTime / 1000; // seconds
    this.isAutoLogout = true; // mark this timeout as auto logout

    // Optional: console countdown
    let countdown = remaining;
    this.intervalId = setInterval(() => {
      countdown--;
      console.log(`⏳ Logging out in ${countdown}s`);
      if (countdown <= 0) clearInterval(this.intervalId);
    }, 1000);

    // Auto logout after inactivityTime
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => {
          this.clearUserSession();
        });
      }, this.inactivityTime);
    });
  }

  /** Check session expiry on page load or tab reopen */
  checkSessionOnLoad(): void {
    const expiry = localStorage.getItem('sessionExpiry');
    if (expiry) {
      const now = new Date().getTime();
      if (now > parseInt(expiry, 10)) {
        this.isAutoLogout = true; // mark this as auto logout
        this.clearUserSession();
      }
    }
  }
}
