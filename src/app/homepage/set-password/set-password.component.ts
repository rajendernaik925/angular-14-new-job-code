import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { use } from 'echarts';
import { AuthService } from 'src/app/auth.service';
import { PasswordService } from 'src/app/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.sass']
})
export class SetPasswordComponent implements OnInit {

  passwordForm!: FormGroup;
  submitted = false;
  disableButton = false;
  loggedUser: any;
  loginCount: any;
  unsavedChanges: boolean = true;

  // showCurPassword = false;
  showNewPassword = false;
  showConfrmPassword = false;
  public deviceInfo: any;
  userData: any;
  checkIcon: string = 'assets/img/idcard/patch-check.svg'

  LoginPaswd = 'Hetero@123';

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   if (this.unsavedChanges) {
  //     $event.returnValue = true; // Shows default confirmation dialog
  //   }
  // }

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private passwordService: PasswordService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const rawUser = localStorage.getItem('userData');

    if (!rawUser) {
      // No userData in localStorage → redirect to login
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    try {
      this.loggedUser = decodeURIComponent(window.atob(rawUser));
      const userData = JSON.parse(this.loggedUser);

      console.log("login count :", userData?.user?.firstLogin);
      this.loginCount = userData?.user?.firstLogin;

      if (!userData || !userData.user) {
        this.router.navigate(['/login'], { replaceUrl: true });
      }

    } catch (error) {
      console.error("Invalid userData in localStorage", error);
      this.router.navigate(['/login'], { replaceUrl: true });
    }


    if (this.loginCount === 0) {
      this.router.navigate(['/home'], { replaceUrl: true });
    }

    let device = decodeURIComponent(window.atob(localStorage.getItem('applction')));
    this.deviceInfo = JSON.parse(device).deviceInfo;

    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);

    this.passwordForm = this.fb.group({
      // curPassword: ['', [Validators.required, Validators.minLength(6), this.matchOldPassword.bind(this)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$&]).{6,15}$/)
        ]
      ],
      confrmPassword: ['', [Validators.required]]
    });

    // this.passwordForm.patchValue({
    //   curPassword: this.LoginPaswd
    // });
  }

  // Getter for easy access
  get f(): { [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }

  // Validate current password matches existing
  matchOldPassword(control: AbstractControl) {
    if (control.value && control.value !== this.LoginPaswd) {
      return { notEquivalent1: true };
    }
    return null;
  }

  // Validate new password and confirm password match
  passwordsMatch(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confrmPass = group.get('confrmPassword')?.value;
    Swal.fire('Error', 'New Password and Confirm Password do not match', 'error');
    return newPass === confrmPass ? null : { notEquivalent: true };
  }

  toggleField(field: string) {
    // if (field === 'cur') this.showCurPassword = !this.showCurPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confrm') this.showConfrmPassword = !this.showConfrmPassword;
  }

  updatePasswrd() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    this.disableButton = true;

    // Prepare payload for API
    const payload = {
      // oldPassword: this.f.curPassword.value,
      confrmPassword: this.f.confrmPassword.value,
      application: this.deviceInfo?.deviceType || 'Web',
      empID: this.userData.user.empID,
    };

    const pword = this.f.newPassword.value;
    const confirmPword = this.f.confrmPassword.value;

    if (pword !== confirmPword) {
      Swal.fire('Error', 'New Password and Confirm Password do not match', 'error');
      this.disableButton = false;
      return;
    }
    this.disableButton = false;

    this.authService.changepassword(payload).subscribe({
      next: (res: any) => {
        Swal.fire('Success', 'Password updated successfully. Please log in again.', 'success');
        this.disableButton = false;
        this.passwordService.setFirstLoginToZero();
        localStorage.clear();
        this.router.navigate(['/login']);


      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Password update failed', 'error');
        this.disableButton = false;
      }
    });
  }

  // ngOnDestroy(): void {
  //   // Reset state
  //   this.unsavedChanges = false;
  // }


  strength = { percent: 0, label: '', class: '', color: '' };

checkStrength(password: string): void {
  let score = 0;

  if (!password) {
    this.strength = { percent: 0, label: '', class: '', color: '' };
    return;
  }

  // Rules
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;

  // Map to strength
  if (score <= 1) {
    this.strength = { percent: 33, label: 'Weak', class: 'bg-danger', color: '#dc3545' };
  } else if (score === 2 || score === 3) {
    this.strength = { percent: 66, label: 'Average', class: 'bg-warning', color: '#ffc107' };
  } else {
    this.strength = { percent: 100, label: 'Strong', class: 'bg-success', color: '#28a745' };
  }
}


matchSuccess = false;

checkPasswordMatch(): void {
  const newPass = this.passwordForm.get('newPassword')?.value;
  const confirmPass = this.passwordForm.get('confrmPassword')?.value;

  // Trigger animation only if both match and form is valid
  if (newPass && confirmPass && newPass === confirmPass) {
    this.matchSuccess = true;

    // Reset after animation duration
    // setTimeout(() => this.matchSuccess = false, 1500);
  } else {
    this.matchSuccess = false;
  }
}



}
