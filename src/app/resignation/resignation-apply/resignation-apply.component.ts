import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resignation-apply',
  templateUrl: './resignation-apply.component.html',
  styleUrls: ['./resignation-apply.component.sass']
})
export class ResignationApplyComponent implements OnInit {



  resignationForm: FormGroup;
  fileError: string | null = null;
  resignationFile: File | null = null;
  colorTheme = 'theme-dark-blue';
  maxDate: Date;
  minDate: Date = new Date();
  selectedFileName: string | null = null;
  trackStatusValue: boolean = true;
  isVisible: boolean = false;

  constructor(private fb: FormBuilder) {
    this.resignationForm = this.fb.group({
      reason: ['', Validators.required],
      // lastWorkingDate: ['', Validators.required],
      // Joining: ['', Validators.required],
      discussed: ['', Validators.required],
      // comments: [''],
      resignationLetter: [null, Validators.required]
    });

    const today = new Date();
    this.maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()); // next 3 months

     this.resignForm = this.fb.group({
      reason: [''],
      discussed: [''],
      joiningAnother: [''],
      considerStay: [''],
      managerComment: ['']
    });
  }

  ngOnInit(): void {
    this.trackStatusValue = true;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.selectedFileName = null;
      } else {
        this.fileError = null;
        this.selectedFileName = file.name;
        // You can store or upload the file here if needed
      }
    }
  }

  onSubmit(): void {
    if (this.resignationForm.valid) {
      console.log('Form Data:', this.resignationForm.value);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Resignation Applied Successfully'
      });
      this.trackStatusValue = false;
    } else {
      this.resignationForm.markAllAsTouched();
    }
  }

  trackStatus() {
    console.log("track status");
    this.trackStatusValue = false;
  }

  tempClick() {
    this.trackStatusValue = true;
  }

  discussedOnChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue == 'No') {
      Swal.fire({
        icon: 'error',
        title: 'Manager Discussion Required',
        text: 'Please discuss with your manager before applying for resignation.'
      });
      this.resignationForm.patchValue({ discussed: '' });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Have you discussed this with your manager?',
        showCancelButton: true,
        confirmButtonText: 'Yes, Im Sure',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (!result.isConfirmed) {
          this.resignationForm.patchValue({ discussed: '' });
        }
      });

    }
  }

  modelOpen() {
    this.isVisible = true;
    console.log("rajender")
  }

  closeModal() {
    this.isVisible = false;
  }

  candidateName = 'Rajender Nayak'; // dynamically from data
  resignForm!: FormGroup;

   submitResignationForm() {
    if (this.resignForm.valid) {
      console.log('Form Submitted:', this.resignForm.value);
      this.closeModal();
    } else {
      alert('Please fill all required fields.');
    }
  }

}
