// src/app/services/session-timeout.service.ts
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService implements OnDestroy {
  // configure times in milliseconds
  private readonly idleObservation = 2 * 60 * 1000; // total inactivity threshold (2 minutes)
  private readonly modalAfter = 1 * 60 * 1000;      // show modal after 1 minute of inactivity
  private readonly modalCountdown = this.idleObservation - this.modalAfter; // 1 minute countdown

  private idleTimeoutId: any = null;     // triggers final logout if modal ignored
  private modalTimeoutId: any = null;    // triggers showing the modal
  private activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'click', 'scroll'];
  private modalInterval: any = null;     // updating countdown inside the Swal
  private isMonitoring = false;

  // keys you provided to be removed on logout
  private localStorageKeysToRemove: string[] = [
    "userData",
    "loginData",
    "currentDate",
    "othrPrevlgs",
    "privileges",
    "newParams",
    "letterprivileges",
    "sessionExpiry"
  ];

  // key to persist last activity time (ms since epoch)
  private readonly lastActivityKey = 'session_lastActivity';

  constructor(private router: Router, private ngZone: NgZone) {}

  /**
   * Start monitoring user activity.
   * This will resume timers based on the persisted lastActivity (so refresh won't log out immediately).
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // attach activity listeners
    this.activityEvents.forEach(evt => window.addEventListener(evt, this.resetTimers, true));

    // initialize or resume timers based on persisted last activity
    this.resumeOrInitTimers();
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;

    // remove listeners
    this.activityEvents.forEach(evt => window.removeEventListener(evt, this.resetTimers, true));

    // clear timers
    this.clearAllTimers();
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }

  /**
   * Called on user activity. Updates lastActivity and resets timers.
   */
  private resetTimers = () => {
    // Update last activity to now (persist so refresh retains it)
    try {
      localStorage.setItem(this.lastActivityKey, Date.now().toString());
    } catch (err) {
      console.warn('Could not persist last activity', err);
    }

    // run outside Angular to avoid extra change detection for frequent events
    this.ngZone.runOutsideAngular(() => {
      // clear existing timers
      clearTimeout(this.modalTimeoutId);
      clearTimeout(this.idleTimeoutId);

      // set modal show timer (after `modalAfter` ms of no activity)
      this.modalTimeoutId = setTimeout(() => {
        this.ngZone.run(() => this.showContinueOrLogoutModal());
      }, this.modalAfter);

      // set final logout timer (in case modal never shown or user does not click)
      this.idleTimeoutId = setTimeout(() => {
        this.ngZone.run(() => this.logout('timeout'));
      }, this.idleObservation);
    });
  }

  /**
   * When starting, use the persisted last activity to calculate elapsed time.
   * This avoids treating refresh as inactivity that immediately logs out.
   */
  private resumeOrInitTimers() {
    const now = Date.now();
    let lastActivity = null;
    try {
      const v = localStorage.getItem(this.lastActivityKey);
      lastActivity = v ? parseInt(v, 10) : null;
    } catch (err) {
      console.warn('Error reading lastActivity from localStorage', err);
    }

    if (!lastActivity || isNaN(lastActivity)) {
      // No persisted activity — set now and start fresh timers
      try { localStorage.setItem(this.lastActivityKey, now.toString()); } catch {}
      this.resetTimers();
      return;
    }

    const elapsed = now - lastActivity;

    if (elapsed >= this.idleObservation) {
      // already expired while page was closed / or too long inactive -> logout immediately
      this.logout('expired_while_closed_or_long_inactivity');
      return;
    }

    // If elapsed is less than modalAfter -> schedule modal after (modalAfter - elapsed)
    // If elapsed is between modalAfter and idleObservation -> directly show modal with remaining countdown
    if (elapsed < this.modalAfter) {
      const toModal = this.modalAfter - elapsed; // ms until modal should appear
      const toLogout = this.idleObservation - elapsed; // ms until final logout

      // set modal timer
      this.modalTimeoutId = setTimeout(() => {
        this.ngZone.run(() => this.showContinueOrLogoutModal());
      }, toModal);

      // set final logout timer
      this.idleTimeoutId = setTimeout(() => {
        this.ngZone.run(() => this.logout('timeout'));
      }, toLogout);
    } else {
      // we're already past modalAfter but not yet past idleObservation -> show modal with remaining countdown
      const remainingUntilLogout = this.idleObservation - elapsed; // ms left in countdown
      this.showContinueOrLogoutModal(remainingUntilLogout);
    }
  }

  private clearAllTimers() {
    clearTimeout(this.modalTimeoutId);
    clearTimeout(this.idleTimeoutId);
    this.modalTimeoutId = null;
    this.idleTimeoutId = null;

    if (this.modalInterval) {
      clearInterval(this.modalInterval);
      this.modalInterval = null;
    }
  }

  /**
   * Show the Swal modal.
   * If `overrideCountdownMs` is provided we use it as the countdown length (useful when resuming after refresh).
   */
  private showContinueOrLogoutModal(overrideCountdownMs?: number) {
    // stop the idleTimeout that would double-fire
    if (this.idleTimeoutId) {
      clearTimeout(this.idleTimeoutId);
      this.idleTimeoutId = null;
    }

    const countdownMs = (typeof overrideCountdownMs === 'number') ? overrideCountdownMs : this.modalCountdown;
    // be safe: ensure at least 1 second
    const countdownSecondsStart = Math.max(1, Math.ceil(countdownMs / 1000));

    let remaining = countdownSecondsStart;

    Swal.fire({
      title: 'Are you still there?',
      html: `You will be logged out automatically in <strong id="swal-timer">${remaining}</strong> seconds.`,
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Logout',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const timerEl = document.getElementById('swal-timer');
        this.modalInterval = setInterval(() => {
          remaining -= 1;
          if (timerEl) timerEl.textContent = String(remaining);
          if (remaining <= 0) {
            if (this.modalInterval) {
              clearInterval(this.modalInterval);
              this.modalInterval = null;
            }
          }
        }, 1000);
      },
      willClose: () => {
        if (this.modalInterval) {
          clearInterval(this.modalInterval);
          this.modalInterval = null;
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        // user wants to continue — update lastActivity and reset timers
        try { localStorage.setItem(this.lastActivityKey, Date.now().toString()); } catch {}
        this.resetTimers();
      } else {
        // treat cancel/dismiss as logout
        this.logout('user_choice_or_modal_dismiss');
      }
    });

    // safety fallback: auto logout after countdown if Swal promise doesn't resolve
    this.idleTimeoutId = setTimeout(() => {
      Swal.close();
      this.logout('modal_countdown_end');
    }, countdownMs);
  }

  /**
   * Logout flow: clear provided keys and lastActivity, stop monitoring and navigate to login.
   */
  private logout(reason: string) {
    // stop monitoring while logging out
    this.stopMonitoring();

    // clear localStorage keys you provided
    try {
      this.localStorageKeysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.removeItem(this.lastActivityKey);
    } catch (err) {
      console.warn('Error clearing localStorage keys on logout', err);
    }

    // (Optional) call server logout endpoint here if you have one

    // navigate to login (adjust route as per your app)
    try {
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (err) {
      console.error('Navigation error during logout', err);
    }

    console.log(`Logged out due to: ${reason}`);
  }
}
