import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  registrationForm: FormGroup;
  isFresher: boolean = true;
  jobCodeData: any;
  selectedFiles: { [key: string]: File } = {};
  isSidebarOpen: boolean = false;
  isLoading: boolean = false;
  isUpdateMode: boolean = false;
  isAllDataPresent: boolean = false;
  isAllAddressDataPresent: boolean = false;
  personalUpdate: boolean = false;
  addressUpadte: boolean = false;
  colorTheme = 'theme-dark-blue';
  @ViewChild('hiddenResumeInput') hiddenResumeInput!: ElementRef;
  resumePath: string = '';


  resumeFile: string | null = null;
  fileURL: SafeResourceUrl | null = null;
  showPDF: boolean = false;
  maxDob!: Date;
  loadedData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: [''],
      dob: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      highestDegree: ['', Validators.required],
      adhar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      resume: ['', Validators.required],
      isFresher: ['fresher', Validators.required],
      companyName: ['', Validators.required],
      totalExperience: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.handleExperienceToggle('fresher');
    const loginData = JSON.parse(localStorage.getItem('hiringFieldLoginData') || '{}');
    this.jobCodeData = loginData;
    console.log("hiring login data : ", this.jobCodeData.email)
    this.registrationForm.get('jobCodeId')?.setValue(this.jobCodeData?.jobCodeRefId);
    this.registrationForm.get('email')?.setValue(this.jobCodeData.email);
    this.registrationForm.get('firstName')?.setValue(this.jobCodeData.name);
    this.registrationForm.get('mobileNumber')?.setValue(this.jobCodeData.mobileNumber);
    if (!this.jobCodeData.status) {
      this.router.navigate(['/hiring-login']);
    }

    const today = new Date();
    this.maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());



    if (this.jobCodeData.candidateId) {
      this.loadUserData();
    }
  }




  loadUserData() {
    this.isLoading = true;
    this.authService.registeredData(this.jobCodeData.candidateId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.loadedData = res;
        if (
          res?.candidatePersonalInformationDetails ||
          res?.candidateCommunicationAddressDetails ||
          res?.candidatePermanentAddressDetails ||
          (res?.candidateEducationDetails && res.candidateEducationDetails.length > 0) ||
          res?.candidateDocumentDetails ||
          res?.candidateExperienceDetails?.candidateJoiningDetails ||
          (res?.candidateExperienceDetails?.candidateCompanyDetails && res.candidateExperienceDetails.candidateCompanyDetails.length > 0) ||
          res?.candidateExperienceDetails?.candidateSalaryDetails
        ) {

          this.resumeFile = res?.candidatePersonalInformationDetails?.resumeFile || null;
          this.resumePath = res?.candidatePersonalInformationDetails?.resume || null;

          const isFresher = res?.candidateExperienceDetails?.candidateJoiningDetails?.is_Fresher ? 'fresher' : 'experienced';

          // Patch form data
          this.registrationForm.patchValue({
            firstName: res?.candidatePersonalInformationDetails?.firstName ? res.candidatePersonalInformationDetails.firstName : this.jobCodeData.name,
            mobileNumber: res?.candidatePersonalInformationDetails?.mobileNumber ? res.candidatePersonalInformationDetails.mobileNumber : this.jobCodeData.mobileNumber,
            lastName: res?.candidatePersonalInformationDetails?.lastName || '',
            dob: res?.candidatePersonalInformationDetails?.dob || '',
            highestDegree: res?.candidatePersonalInformationDetails?.highestDegree || '',
            adhar: res?.candidatePersonalInformationDetails?.adhar || '',
            companyName: res?.candidatePersonalInformationDetails?.companyName || '',
            totalExperience: res?.candidatePersonalInformationDetails?.totalExperience || '',

            // Experience Details
            isFresher: isFresher,
            // resume: res?.candidatePersonalInformationDetails?.resume || '',
          });

          console.log("Father Name:", res?.candidatePersonalInformationDetails?.firstName);

          this.isAllDataPresent = [res?.candidatePersonalInformationDetails?.firstName]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.handleExperienceToggle(isFresher);


        } else {
          this.resumeFile = null;
        }
      },

      error: (err: HttpErrorResponse) => {
        console.log('HTTP Error:', err);
        this.isLoading = false;
      }
    });
  }




  viewFile(file: any) {
    if (!file) {
      console.error("No file available for download.");
      return;
    }

    const byteCharacters = atob(file);
    const byteNumbers = new Array(byteCharacters?.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const objectURL = URL.createObjectURL(blob);

    // ✅ Sanitize the URL before assigning
    this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    this.showPDF = true;
  }

  closePDF() {
    this.showPDF = false; // Hide the modal
    this.fileURL = null; // Clear the URL
  }


  onlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();

      // Show SweetAlert warning
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Only numbers (0-9) are allowed.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }



  onlyNumbersWithDot(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const input = event.key;
    const currentValue = (event.target as HTMLInputElement).value;

    // Allow control keys
    if (allowedKeys.includes(input)) {
      return;
    }

    // Allow numbers (0-9)
    if (/^\d$/.test(input)) {
      // Prevent entering more than two digits before the dot
      if (!currentValue.includes('.') && currentValue.length >= 2) {
        event.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Input',
          text: 'You cannot enter more than 2 digits before the dot.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      return;
    }

    // Allow only one dot (.)
    if (input === '.') {
      if (currentValue.includes('.')) {
        event.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Input',
          text: 'Only one dot (.) is allowed.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      return;
    }

    // Show SweetAlert for other invalid inputs
    event.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Input',
      text: 'Please enter only numbers (0-9) with a single dot (.) for decimal values.',
      timer: 2000,
      showConfirmButton: false
    });
  }












  handleExperienceToggle(value: string): void {
    this.isFresher = value === 'fresher';

    if (this.isFresher) {
      // Clear validators for experience-related fields
      ['companyName', 'totalExperience', 'LastOrStill_Working_Date', 'currentSalary', 'expectedSalary',
        'suitableJobDescription'].forEach(field => {
          this.registrationForm.get(field)?.clearValidators();
          this.registrationForm.get(field)?.setValue('');
        });

      // Ensure only joiningTime is considered
      this.registrationForm.get('joiningTime')?.setValidators(Validators.required);

    } else {
      // Apply validators for experience fields
      ['companyName', 'totalExperience', 'LastOrStill_Working_Date', 'currentSalary', 'expectedSalary',
        'suitableJobDescription'].forEach(field => {
          this.registrationForm.get(field)?.setValidators(Validators.required);
        });

      // Remove validators from joiningTime since it is not required for experienced candidates
      // this.registrationForm.get('joiningTime')?.clearValidators();
      // this.registrationForm.get('joiningTime')?.setValue('');
    }

    // Update form validation
    Object.keys(this.registrationForm.controls).forEach(field => {
      this.registrationForm.get(field)?.updateValueAndValidity();
    });
  }


  onFileSelect(event: Event, fieldName: string): void {

    console.log("file name : ", fieldName)
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    // Check file type
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type!',
          text: 'Please upload a PDF file only.',
        });
        (event.target as HTMLInputElement).value = '';
        return;
      }

      // Check file size
      if (file.size > maxSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'File too large!',
          text: 'Please select a file smaller than 5 MB.',
        });
        (event.target as HTMLInputElement).value = '';
        return;
      }
    }

    if (file) {
      const selectedFile = new File([file], file.name, { type: file.type, lastModified: Date.now() });

      console.log(`Selected file for ${fieldName}:`, selectedFile);

      this.selectedFiles[fieldName] = selectedFile;
    } else {
      console.log(`No file selected for ${fieldName}`);
    }
  }

  openResumeFileInput(): void {
    // this.hiddenResumeInput.nativeElement.click();
    this.resumeFile = null;
  }

  setValidation(Action: string) {
    if (Action === 'experience') {
      let isValid = true;
      // if (this.resumeFile || this.resumePath) {
      //   this.registrationForm.get('resume')?.clearValidators();
      //   this.registrationForm.get('resume')?.setValue(this.resumePath);
      // }
      if (this.resumeFile || this.resumePath) {
        const resumeControl = this.registrationForm.get('resume');
        resumeControl?.clearValidators();
        resumeControl?.updateValueAndValidity(); // refresh validators
      }


      // Required fields based on fresher/experienced
      const requiredFields = this.isFresher
        ? ['isFresher', 'email', 'firstName', 'lastName', 'mobileNumber', 'dob', 'highestDegree', 'adhar', 'resume']
        : ['companyName', 'totalExperience', 'isFresher', 'email', 'firstName', 'lastName', 'mobileNumber', 'dob', 'highestDegree', 'adhar', 'resume'];

      // Validate form
      requiredFields.forEach(field => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      });

      if (!isValid) {
        this.formFillMessageAlert();
        return;
      }

      const formValues = { ...this.registrationForm.value };

      // Format DOB
      if (formValues.dob) {
        const dateObj = new Date(formValues.dob);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        formValues.dob = `${yyyy}-${mm}-${dd}`;
      }

      // Build final JSON
      // const experienceData: any = {
      //   candidateId: this.jobCodeData.candidateId,
      //   firstName: formValues.firstName || null,
      //   lastName: formValues.lastName || null,
      //   email: formValues.email || null,
      //   mobile: formValues.mobileNumber || null,
      //   dob: formValues.dob || null,
      //   aadhar: formValues.adhar || null,
      //   isFresher: formValues.isFresher === 'fresher',
      //   company: formValues.isFresher === 'fresher' ? null : formValues.companyName || null,
      //   experience: formValues.isFresher === 'fresher' ? 0.0 : formValues.totalExperience || 0.0,
      //   highestDegree: formValues.highestDegree || null,
      //   // resume: formValues.resume || null,
      // };

      const experienceData: any = {
        candidateId: this.jobCodeData.candidateId,
        email: formValues.email || null,
        mobileNumber: formValues.mobileNumber || null,
        dob: formValues.dob || null,
        firstName: formValues.firstName || null,
        lastName: formValues.lastName || null,
        highestDegree: formValues.highestDegree || null,
        aadharNumber: formValues.adhar || null,
        isFresherFlag: formValues.isFresher === 'fresher' ? 1 : 0,   // 1 = Fresher, 0 = Experienced
        companyName: formValues.isFresher === 'fresher' ? null : formValues.companyName || null,
        totalExperience: formValues.isFresher === 'fresher' ? null : formValues.totalExperience || null,
      };


      console.log("DOB for backend:", formValues.dob);
      console.log("Experience Data:", experienceData);

      const formData = new FormData();
      formData.append('personalInfo', JSON.stringify(experienceData));
      if (!this.resumeFile) {
        formData.append('personalResumeFile', this.selectedFiles['resume'] || new File([], ''));
      }
      this.finalSave('experience', formData);
    }
  }


  finalSave(action: string, formData) {
    // alert(formData)
    console.log(" form data : ", formData);
    this.isLoading = true;
    this.authService.registration(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('Registration Response:', res);
        Swal.fire({
          title: 'Success',
          text: 'Successfully saved data!',
          icon: 'success',
          showConfirmButton: true,
        });
        ; this.loadUserData();
        this.selectedFiles = {};
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('HTTP Error:', err);
      }
    })
  }

  formFillMessageAlert() {
    Swal.fire({
      title: 'Warning',
      text: 'Please fill all required fields!',
      icon: 'warning',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  logout(): void {
    Swal.fire({
      html: `
        <div class="mb-3">
          <img src="assets/img/job-code/logout-gif.gif" alt="logout" style="width:60px; height:60px; " />
        </div>
        <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to log out?</h5>
        <p class="text-muted mb-0" style="font-size: 14px;">
          You will need to log in again to access your profile and application details.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Log Out',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        // actions: 'd-flex justify-content-center',
        confirmButton: 'btn btn-danger btn-sm w-100 mb-2 shadow-none',
        cancelButton: 'btn btn-sm btn-outline-secondary w-100',
      },
      buttonsStyling: false,
      width: '500px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('hiringFieldLoginData');
        this.router.navigate(['/hiring-login']);
      }
    });
  }

  formatFullDateForInterview(dateStr: string): string {
    if (!dateStr) return '';

    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    const dayStr = day.toString().padStart(2, '0');
    const monthName = date.toLocaleString('default', { month: 'long' });

    return `${dayStr} ${monthName} ${year}`;
  }


}
