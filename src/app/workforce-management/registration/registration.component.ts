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


  resumeFile: string | null = null;
  photoFile: string | null = null;
  tenthFile: string | null = null;
  twelthFile: string | null = null;
  deplomaFile: string | null = null;
  degreeOrBTechFile: string | null = null;
  othersFile: string | null = null;
  fileURL: SafeResourceUrl | null = null;
  showPDF: boolean = false;
  updateDocumentFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
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
    const loginData = JSON.parse(localStorage.getItem('hiringLoginData') || '{}');
    this.jobCodeData = loginData;
    console.log("hiring login data : ", this.jobCodeData.email)
    this.registrationForm.get('jobCodeId')?.setValue(this.jobCodeData?.jobCodeRefId);
    this.registrationForm.get('email')?.setValue(this.jobCodeData.email);
    this.registrationForm.get('firstName')?.setValue(this.jobCodeData.name);
    this.registrationForm.get('mobileNumber')?.setValue(this.jobCodeData.mobileNumber);
    // if (!this.jobCodeData.status) {
    //   this.router.navigate(['/hiring-login']);
    // }


    if (this.jobCodeData.candidateId) {
      // this.loadUserData();
    }
  }




  loadUserData() {
    this.authService.registeredData(this.jobCodeData.candidateId).subscribe({
      next: (res: any) => {
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
          console.log("Registered Data:", res?.candidateCommunicationAddressDetails?.postalCode);

          this.resumeFile = res?.candidatePersonalInformationDetails?.resumeFile || null;
          this.photoFile = res?.candidatePersonalInformationDetails?.imageFile || null;
          this.tenthFile = res?.candidateDocumentDetails?.tenthFile || null;
          this.twelthFile = res?.candidateDocumentDetails?.intermediateFile || null;
          this.deplomaFile = res?.candidateDocumentDetails?.pgFile || null;
          this.degreeOrBTechFile = res?.candidateDocumentDetails?.degreeFile || null;
          this.othersFile = res?.candidateDocumentDetails?.otherFile || null;

          const isFresher = res?.candidateExperienceDetails?.candidateJoiningDetails?.is_Fresher ? 'fresher' : 'experienced';

          // Patch form data
          this.registrationForm.patchValue({
            firstName: res?.candidatePersonalInformationDetails?.firstName ? res.candidatePersonalInformationDetails.firstName : this.jobCodeData.name,
            mobileNumber: res?.candidatePersonalInformationDetails?.mobileNumber ? res.candidatePersonalInformationDetails.mobileNumber : this.jobCodeData.mobileNumber,
            middleName: res?.candidatePersonalInformationDetails?.middleName || '',
            lastName: res?.candidatePersonalInformationDetails?.lastName || '',
            maritalStatusId: res?.candidatePersonalInformationDetails?.maritalStatusId || null,
            genderId: res?.candidatePersonalInformationDetails?.genderId || null,
            titleId: res?.candidatePersonalInformationDetails?.titleId || null,
            dob: res?.candidatePersonalInformationDetails?.dob || '',
            highestDegree: res?.candidatePersonalInformationDetails?.fatherName || '',
            district: res?.candidatePersonalInformationDetails?.district || '',
            pan: res?.candidatePersonalInformationDetails?.pan || '',
            adhar: res?.candidatePersonalInformationDetails?.adhar || '',

            // Communication Address
            addressA: res?.candidateCommunicationAddressDetails?.comAddressA || '',
            addressB: res?.candidateCommunicationAddressDetails?.comAddressB || '',
            addressC: res?.candidateCommunicationAddressDetails?.comAddressC || '',
            stateId: res?.candidateCommunicationAddressDetails?.stateId || null,
            cityId: res?.candidateCommunicationAddressDetails?.cityId || null,
            addressFlag: res?.candidateCommunicationAddressDetails?.addressFlag || 'no',

            // Permanent Address
            permanentAddressA: res?.candidatePermanentAddressDetails?.perAddressA || '',
            permanentAddressB: res?.candidatePermanentAddressDetails?.perAddressB || '',
            permanentAddressC: res?.candidatePermanentAddressDetails?.perAddressC || '',
            permanentStateId: res?.candidatePermanentAddressDetails?.stateId || null,
            permanentCityId: res?.candidatePermanentAddressDetails?.cityId || null,

            // Experience Details
            isFresher: isFresher,
            joiningTime: res?.candidateExperienceDetails?.candidateJoiningDetails?.joiningId || '',
            currentSalary: res?.candidateExperienceDetails?.candidateSalaryDetails?.currentSalary || '',
            expectedSalary: res?.candidateExperienceDetails?.candidateSalaryDetails?.expectedSalary || '',
            suitableJobDescription: res?.candidateExperienceDetails?.candidateSalaryDetails?.description || '',
          });

          console.log("Father Name:", res?.candidatePersonalInformationDetails?.fatherName);

          this.isAllDataPresent = [res?.candidatePersonalInformationDetails?.fatherName]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isAllAddressDataPresent = [res?.candidateCommunicationAddressDetails?.comAddressA]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.handleExperienceToggle(isFresher);

          console.log("Rajender");


        } else {
          this.resumeFile = null;
          this.photoFile = null;
          this.tenthFile = null;
          this.twelthFile = null;
          this.deplomaFile = null;
          this.degreeOrBTechFile = null;
          this.othersFile = null;
        }
      },

      error: (err: HttpErrorResponse) => {
        console.log('HTTP Error:', err);
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

    if (file) {
      const selectedFile = new File([file], file.name, { type: file.type, lastModified: Date.now() });

      console.log(`Selected file for ${fieldName}:`, selectedFile);

      this.selectedFiles[fieldName] = selectedFile;
    } else {
      console.log(`No file selected for ${fieldName}`);
    }
  }



  setValidation(Action: string) {
    if (Action === 'experience') {
      let isValid = true;
      const requiredFields = this.isFresher
        ? ['isFresher', 'email', 'firstName', 'lastName', 'mobileNumber', 'dob', 'highestDegree', 'adhar', 'resume']
        : ['companyName', 'totalExperience', 'isFresher', 'email', 'firstName', 'lastName', 'mobileNumber', 'dob', 'highestDegree', 'adhar', 'resume'];

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

      // ✅ Convert display date (DD-MMM-YYYY) to backend format (YYYY-MM-DD)
      if (formValues.dob) {
        const dateObj = new Date(formValues.dob);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        formValues.dob = `${yyyy}-${mm}-${dd}`;
      }

      if (this.isFresher) {
        delete formValues.companyName;
        delete formValues.totalExperience;
      }

      const experienceData: any = {
        candidateId: this.jobCodeData.candidateId,
        isFresher: formValues.isFresher === 'fresher',
        ...formValues
      };

      if (!this.isFresher) {
        experienceData.experienceMapDTO = [
          {
            companyName: formValues.companyName,
            totalExp: formValues.totalExperience
          }
        ];
      }

      console.log("DOB for backend:", formValues.dob); // YYYY-MM-DD
      console.log("Experience Data:", experienceData);

      const formData = new FormData();
      formData.append('experience', JSON.stringify(experienceData));
      formData.append('jobCodeId', this.jobCodeData?.jobCodeId);
      formData.append('candidateId', this.jobCodeData.candidateId);
      formData.append('moduleId', '5');

      this.finalSave('experience', formData);
    }
  }

  finalSave(action: string, formData) {
    console.log(" form data : ", formData);
    Swal.fire({
      title: 'Success',
      text: 'Successfully saved data!',
      icon: 'success',
      showConfirmButton: true,
    });

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


}
