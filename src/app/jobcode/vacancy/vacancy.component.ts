import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';


interface Candidate {
  fullName: string;
  email: string;
  mobileNumber: string;
  workExp: number;
  resume?: string;
  employeeType: string;
}



@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.sass'],
})
export class VacancyComponent implements OnInit {
  myDate: string = '';
  userData: any;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredJobs: any[] = [];
  rows: any[] = [];
  viewMoreValue: boolean = false;
  vacancyValue: boolean = true;
  submitted = false;
  isLoading: boolean = true;
  jobCodeData: any;
  candidateId: string | null = null;
  searchQuery: FormControl = new FormControl();
  @ViewChild('addCandidateDialog', { static: true }) addCandidateDialog!: TemplateRef<any>;
  private dialogRef: any;
  addCandidateForm: FormGroup;
  uploadedFile: File | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  searchQueryText: string = '';
  dataNotFound: string = 'assets/img/icons/not-found.gif'
  referenceJobCode: string | null = null;
  fileURL: SafeResourceUrl | null = null;
  showPDF: boolean = false;
  isEmployeeTypeInvalid = false;
  selectedEmployeeType: string = '';
  employeeTypes = [
    { id: 1, name: 'Office Candidate' },
    { id: 2, name: 'Field Candidate' }
  ];
  candidates: Candidate[] = [];


  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.addCandidateForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      // mobileNumber: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      workExperience: ['', [Validators.required]],
      jobCodeId: ['', Validators.required],
      employeeType: [2, Validators.required],
      resume: [{ value: null, disabled: false }],
    });
  }

  ngOnInit(): void {
    this.vacancyValue = true;
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate') || ''));
    this.totalJobCodes();
    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);
    this.searchQuery.valueChanges.subscribe((value: string) => {
      if (!value) {
        this.filteredJobs = [...this.rows];
        return;
      }
      const lowerCaseValue = value.toLowerCase();
      this.filteredJobs = this.rows.filter(row =>
        row.job_code?.toString().toLowerCase().includes(lowerCaseValue) ||
        row.job_reportingManager?.toString().toLowerCase().includes(lowerCaseValue)
      );
    });

    this.onEmployeeTypeChange();
  }

  totalJobCodes() {
    this.isLoading = true;

    // Ensure values are valid
    const pageNo = this.currentPage || 1;
    const pageSize = this.pageSize || 10;
    const searchQuery = this.searchQueryText?.trim() || '';

    this.authService.getTotalJobCodes(pageNo, pageSize, searchQuery).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        this.rows = res.list || [];
        this.filteredJobs = [...this.rows];

        // Set totalRecords based on API response
        this.totalRecords = res.totalCount ?? this.rows.length;

        // ✅ Reset Page to 1 if No Data
        if (this.totalRecords === 0) {
          this.currentPage = 1;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error("Error fetching job codes:", err.message);
      }
    });
  }

  viewMore(id: string, jobcode: string): void {
    this.candidateId = id;
    this.referenceJobCode = jobcode;
    this.isLoading = true;
    this.authService.getJobCodeListData(id).subscribe({
      next: (res: any[]) => {
        this.jobCodeData = res;
        this.isLoading = false;
        this.viewMoreValue = true;
        this.vacancyValue = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error fetching job codes:', err.message);
      },
    });
  }

  addCandidate(): void {
    this.submitted = false;
    this.addCandidateForm.reset();
    this.dialogRef = this.dialog.open(this.addCandidateDialog, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true,
    });
    this.uploadedFile = null;
    this.addCandidateForm.patchValue({
      jobCodeId: this.candidateId,
      employeeType: 2
    });

    this.onEmployeeTypeChange();
  }

  // onFileSelect(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     const maxSizeInMB = 5;
  //     const maxSizeInBytes = maxSizeInMB * 1024 * 1024;



  //     if (file.size > maxSizeInBytes) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'File too large',
  //         text: 'Please select a file less than 5 MB.'
  //       });
  //       (event.target as HTMLInputElement).value = '';
  //       return;
  //     }

  //     if (file.type !== 'application/pdf') {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Invalid File Type!',
  //         text: 'Please upload a PDF file only.',
  //       });
  //       (event.target as HTMLInputElement).value = '';
  //       return;
  //     }

  //     this.uploadedFile = file;

  //     const fileBlob = new Blob([file], { type: file.type });

  //     this.addCandidateForm.patchValue({ resume: fileBlob });
  //     this.addCandidateForm.get('resume')?.updateValueAndValidity();
  //   } else {
  //     // console.log('No file selected.');
  //   }
  // }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'File too large',
          text: 'Please select a file less than 5 MB.'
        });
        (event.target as HTMLInputElement).value = '';
        return;
      }

      if (file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type!',
          text: 'Please upload a PDF file only.',
        });
        (event.target as HTMLInputElement).value = '';
        return;
      }

      this.uploadedFile = file;

      const fileBlob = new Blob([file], { type: file.type });

      this.addCandidateForm.patchValue({ resume: fileBlob });
      this.addCandidateForm.get('resume')?.updateValueAndValidity();

      // ✅ Call API immediately after file selection
      const formData = new FormData();
      formData.append('resume', file);

      // this.isLoading = true;

      // this.authService.resumeData(formData).subscribe({
      //   next: (res: any) => {
      //     // this.isLoading = false;
      //     console.log('Resume upload response:', res);
      //     if (res) {
      //       this.addCandidateForm.patchValue({
      //         fullName: res.name || '',
      //         mobileNumber: res.mobile
      //           ? res.mobile.replace(/^(\+91|91)/, '').slice(-10)
      //           : '',
      //         emailAddress: res.email || ''
      //       });
      //     }
      //   },
      //   error: (err: HttpErrorResponse) => {
      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Upload Failed',
      //       text: 'Something went wrong while uploading. Please try again.',
      //     });
      //   }
      // });
    }
  }

  preventNegativeInput(event: KeyboardEvent, currentValue: string): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
    if (currentValue.length >= 10 && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  validExperienceInput(event: KeyboardEvent): void {
    const inputChar = event.key;
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(inputChar)) return;

    if (!/[\d.]/.test(inputChar)) {
      event.preventDefault();
      return;
    }

    if (inputChar === '.' && currentValue === '') {
      event.preventDefault();
      return;
    }

    if (inputChar === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return;
    }

    const parts = currentValue.split('.');

    if (!currentValue.includes('.') && parts[0].length >= 2 && /\d/.test(inputChar)) {
      event.preventDefault();
      return;
    }

    if (parts.length === 2 && parts[1].length >= 2 && /\d/.test(inputChar)) {
      event.preventDefault();
      return;
    }

    if (/^00(\.00?)?$/.test(currentValue + inputChar)) {
      event.preventDefault();
      return;
    }
  }


  CorrectExperienceValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Allow only digits and one dot
    value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    // Split on dot
    let [yearsRaw = '', monthsRaw = ''] = value.split('.');

    // Handle if user types just "."
    if (yearsRaw === '' && monthsRaw !== '') {
      yearsRaw = '0';
    }

    let years = parseInt(yearsRaw || '0', 10);
    let months = parseInt(monthsRaw.slice(0, 2) || '0', 10);

    // If months > 11, roll over to next year
    if (months > 11) {
      years += 1;
      months = 0;
    }

    // Build final string
    let finalValue = '';
    if (value.endsWith('.') && monthsRaw === '') {
      // If user just typed dot, allow e.g. "1." or "0."
      finalValue = `${years}.`;
    } else {
      finalValue = months ? `${years}.${months}` : `${years}`;
    }

    input.value = finalValue;
    this.addCandidateForm.get('workExperience')?.setValue(finalValue);
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;
    if (this.addCandidateForm.invalid) {
      return;
    }
    const formValues = this.addCandidateForm.value;

    const data = {
      fullName: formValues.fullName,
      mobileNumber: formValues.mobileNumber,
      email: formValues.emailAddress,
      workExp: formValues.workExperience,
      createdBy: this.userData.user.empID,
      jobCodeId: this.candidateId,
      employeeType: formValues.employeeType,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('file', this.uploadedFile ?? new File([], 'empty.txt', { type: 'text/plain' }));

    console.log(formData);
    this.authService.CreateJobCandidate(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 200) {
          Swal.fire({
            title: 'Success',
            text: 'Candidate Added Successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.dialogRef.close();
          this.viewMore(this.candidateId, this.referenceJobCode)
          this.addCandidateForm.reset();
          this.uploadedFile = null;
        }
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.viewMore(this.candidateId, this.referenceJobCode)
        // this.addCandidateForm.reset();
        // this.uploadedFile = null;
        if (error.status === 409) {
          Swal.fire({
            title: 'Warning',
            text: error.error.message,
            icon: 'warning',
            confirmButtonText: 'OK',
          });

        } else if (error.status === 500) {
          Swal.fire({
            title: 'Error',
            text: 'Internal server error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
    });
  }

  // tracking(id: any) {
  //   this.candidateId = id;
  //   this.router.navigate(['/tracking',id]);
  // }

  tracking(data: any) {
    console.log("rajjj : ", data)
  }


  back(): void {
    this.viewMoreValue = false;
    this.vacancyValue = true;
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredJobs.sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return 0;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  highlightMatch(text: any): SafeHtml {
    if (!this.searchQueryText || !text) return text;
    const escapedQuery = this.searchQueryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const highlightedText = String(text).replace(regex, `<span class="text-primary" style="font-weight: bold;">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }


  get paginatedRows() {
    return this.filteredJobs;
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    this.totalJobCodes();
  }

  get totalPages() {
    if (this.totalRecords <= this.pageSize) {
      return 1;
    }
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get startIndex() {
    return this.totalRecords ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get endIndex() {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  viewResume(file: any) {
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

  oisEmployeeTypeInvalid = false;

  onEmployeeTypeChange(event?: Event): void {
    let selectedType: number;

    if (event) {
      // when user changes
      selectedType = +(event.target as HTMLInputElement).value;
    } else {
      // initial load → set to 2
      selectedType = 2;
    }

    this.addCandidateForm.get('employeeType')?.setValue(selectedType);
    console.log('Selected Employee Type:', selectedType);

    // validation
    this.isEmployeeTypeInvalid = !selectedType;
  }
  addBulk() {
    const fileInput = document.getElementById('bulkFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      Swal.fire('Error', 'No file selected.', 'error');
      return;
    }

    const file = input.files[0];
    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      // Show Swal alert for invalid file
      Swal.fire('Error', 'Please upload an Excel file (.xls or .xlsx) only.', 'error');
      input.value = ''; // reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const bstr = e.target?.result;
      if (!bstr) {
        Swal.fire('Error', 'Failed to read file.', 'error');
        return;
      }

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const rawData: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const formValues = this.addCandidateForm.value;

      // Map Excel rows to Candidate objects
      // this.candidates = rawData.map((row: any) => ({
      //   fullName: row['Name'] || '',
      //   email: row['Email'] || '',
      //   mobileNumber: row['Mobile Number'] || '',
      //   workExp: Number(row['Total Years of Experience'] || 0),
      //   resume: row['Resume (Optional)'] || '',
      //   employeeType: formValues.employeeType,
      // }));
      this.candidates = rawData
        .filter((row: any) => row['Name'] && row['Email'] && row['Mobile Number'])
        .map((row: any) => ({
          fullName: row['Name'],
          email: row['Email'],
          mobileNumber: row['Mobile Number'],
          workExp: Number(row['Total Years of Experience'] || 0),
          resume: row['Resume (Optional)'] || '',
          employeeType: formValues.employeeType,
        }));


      console.log('Candidates loaded:', this.candidates);
      this.submitCandidatesIndividually();
    };

    reader.readAsBinaryString(file);
  }


  submitCandidatesIndividually() {
    if (!this.candidates.length) {
      Swal.fire('Warning', 'No candidates to submit.', 'warning');
      return;
    }

    // this.isLoading = true;

    const submitNext = (index: number) => {
      if (index >= this.candidates.length) {
        this.isLoading = false;
        Swal.fire('Success', 'Done the Bulk Upload Operation successfully 🎉', 'success');
        this.viewMore(this.candidateId, this.referenceJobCode);
        this.candidates = [];
        this.uploadedFile = null;
        return;
      }

      const candidate = this.candidates[index];

      const data = {
        fullName: candidate.fullName,
        mobileNumber: candidate.mobileNumber,
        email: candidate.email,
        workExp: candidate.workExp,
        createdBy: this.userData.user.empID,
        jobCodeId: this.candidateId,
        employeeType: candidate.employeeType
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append(
        'file',
        this.uploadedFile ?? new File([], 'empty.txt', { type: 'text/plain' })
      );

      this.authService.CreateJobCandidate(formData).subscribe({
        next: () => {
          console.log(`✅ Candidate ${candidate.fullName} submitted successfully`);
          submitNext(index + 1); // continue automatically
        },
        error: (error: HttpErrorResponse) => {
          console.error(`❌ Error submitting candidate ${candidate.fullName}:`, error);

          Swal.fire({
            title: 'Error',
            text: ` ${error?.error?.message}: ${candidate.fullName}`,
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            // only move to next AFTER user clicks OK
            submitNext(index + 1);
          });
        }
      });
    };

    // start with first candidate
    submitNext(0);
  }



}






