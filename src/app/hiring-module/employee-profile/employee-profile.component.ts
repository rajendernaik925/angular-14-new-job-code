import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.sass']
})
export class EmployeeProfileComponent implements OnInit {

  registrationForm: FormGroup;
  activeTab: string = 'personal'
  colorTheme = 'theme-dark-blue';
  communicationCities: any;
  permanentCities: any;
  isEmergency: boolean = false;
  isFullSize: boolean = false;
  maxDate: Date;
  candidateData: any;
  isLoading: boolean = false;

  familyData = [
    {
      "familyFirstName": "Mohan",
      "familyLastName": "Sharma",
      "familyRelation": "Grandfather",
      "familyContactNumber": "9876000001",
      "familyPhoto": "grandfather_photo.jpg",
      "familyAadhar": "111122223333",
      "familyGender": "Male",
      "familyBloodGroup": "B+",
      "familydob": "1945-03-15",
      "familyAge": 80,
      "familyExpired": "No",
      "familyDependent": "No",
      "familyOccupation": "Retired",
      "familyIsPfNominee": "No",
      "familyIsGraduityNominee": "No",
      "familyStatus": "Active"
    },
    {
      "familyFirstName": "Ramesh",
      "familyLastName": "Sharma",
      "familyRelation": "Father",
      "familyContactNumber": "9876000002",
      "familyPhoto": "father_photo.jpg",
      "familyAadhar": "222233334444",
      "familyGender": "Male",
      "familyBloodGroup": "O+",
      "familydob": "1972-06-10",
      "familyAge": 53,
      "familyExpired": "No",
      "familyDependent": "Yes",
      "familyOccupation": "Businessman",
      "familyIsPfNominee": "Yes",
      "familyIsGraduityNominee": "No",
      "familyStatus": "Active"
    },
    {
      "familyFirstName": "Sita",
      "familyLastName": "Sharma",
      "familyRelation": "Mother",
      "familyContactNumber": "9876000003",
      "familyPhoto": "mother_photo.jpg",
      "familyAadhar": "333344445555",
      "familyGender": "Female",
      "familyBloodGroup": "A+",
      "familydob": "1976-09-18",
      "familyAge": 49,
      "familyExpired": "No",
      "familyDependent": "Yes",
      "familyOccupation": "Homemaker",
      "familyIsPfNominee": "No",
      "familyIsGraduityNominee": "Yes",
      "familyStatus": "Active"
    },
    {
      "familyFirstName": "Priya",
      "familyLastName": "Sharma",
      "familyRelation": "Sister",
      "familyContactNumber": "9876000004",
      "familyPhoto": "sister_photo.jpg",
      "familyAadhar": "444455556666",
      "familyGender": "Female",
      "familyBloodGroup": "AB+",
      "familydob": "2000-01-25",
      "familyAge": 25,
      "familyExpired": "No",
      "familyDependent": "Yes",
      "familyOccupation": "Student",
      "familyIsPfNominee": "No",
      "familyIsGraduityNominee": "No",
      "familyStatus": "Active"
    },
    {
      "familyFirstName": "Rahul",
      "familyLastName": "Sharma",
      "familyRelation": "Brother",
      "familyContactNumber": "9876000005",
      "familyPhoto": "brother_photo.jpg",
      "familyAadhar": "555566667777",
      "familyGender": "Male",
      "familyBloodGroup": "O-",
      "familydob": "1998-12-05",
      "familyAge": 27,
      "familyExpired": "No",
      "familyDependent": "No",
      "familyOccupation": "Engineer",
      "familyIsPfNominee": "Yes",
      "familyIsGraduityNominee": "Yes",
      "familyStatus": "Active"
    }
  ];
  selectedFiles: File[] = [];
  familyForm!: FormGroup;
  selectedMemberIndex: number | null = null;
  isOpen: boolean = false;
  empId: number | null = null;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.registrationForm = this.fb.group({
      whatsappNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      alternateNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      Nationality: ['indian', [Validators.required]],
      religion: ['', [Validators.required]],
      motherTongue: ['', [Validators.required]],
      knownLanguage: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      sourceOfReference: ['', [Validators.required]],

      //Emergency contacy details : 
      relation: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      emergencyAddress: ['', [Validators.required]],
      emergencyMail: [],

      //Bank details : 
      bankName: ['', [Validators.required]],
      ifsc: ['', [Validators.required]],
      accNumber: ['', [Validators.required]],
      confirmAccNumber: ['', [Validators.required]],
      identificationMarks1: ['', [Validators.required]],
      identificationMarks2: ['', [Validators.required]],

      // medical Reports
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      descriptionForMedical: [''],

      // Family details
      familyFirstName: ['', [Validators.required]],
      familyLastName: ['', [Validators.required]],
      familyRelation: ['', [Validators.required]],
      familyContactNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      familyPhoto: ['', [Validators.required]],
      familyAadhar: ['', [Validators.required]],
      familyGender: ['', [Validators.required]],
      familyBloodGroup: ['', [Validators.required]],
      familydob: ['', [Validators.required]],
      familyAge: ['', [Validators.required]],
      familyExpired: ['', [Validators.required]],
      familyDependent: ['', [Validators.required]],
      familyOccupation: ['', [Validators.required]],
      familyIsPfNominee: ['', [Validators.required]],
      familyIsGraduityNominee: ['', [Validators.required]],
      familyStatus: ['', [Validators.required]],

      // Agreement Documens
      agreementDocument: ['', [Validators.required]],

      // professional details
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      dateOfJoining: ['', [Validators.required]],
      HQ: ['', [Validators.required]],
      ishod: ['', [Validators.required]],
      firstDay: ['', [Validators.required]],
      reportingManager: ['', [Validators.required]],
      isExperienced: ['', [Validators.required]],
      increamentType: ['', [Validators.required]],
    });

    this.familyForm = this.fb.group({
      familyFirstName: [''],
      familyLastName: [''],
      familyRelation: [''],
      familyContactNumber: [''],
      familyPhoto: [''],
      familyAadhar: [''],
      familyGender: [''],
      familyBloodGroup: [''],
      familydob: [''],
      familyAge: [''],
      familyExpired: [''],
      familyDependent: [''],
      familyOccupation: [''],
      familyIsPfNominee: [''],
      familyIsGraduityNominee: [''],
      familyStatus: ['']
    });


    const eighteenYearsAgo = moment().subtract(18, 'years').toDate();
    this.maxDate = eighteenYearsAgo;
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        try {
          const firstDecode = atob(encodedId);
          const secondDecode = atob(firstDecode);
          this.empId = Number(secondDecode) || null;
          console.log('Decoded Job Code ID:', this.empId);
          if (!this.empId) {
            this.router.navigate(['/hiring/employee-list']);
          } else {
            this.loadUserData(this.empId);
          }
        } catch (error) {
          console.error('Error decoding encoded ID:', error);
          this.empId = null;
        }
      } else {
        this.empId = null;
      }
    });


    this.isEmergency = false;

    this.registrationForm.patchValue({ nationality: 'Indian' });

    if (!this.familyData.length) {
      this.formEnabled = true;
    }

  }

  setActiveSection(section: string) {
    this.activeTab = section;

    Object.keys(this.registrationForm.controls).forEach(field => {
      const control = this.registrationForm.get(field);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity();
      }
    });
  }

  setValidation(Action: string) {
    let isValid = true;
    const sectionData: any = {};

    if (Action === 'personal') {
      const personalFields = [
        'whatsappNumber', 'alternateNumber', 'Nationality', 'religion',
        'knownLanguage', 'alternateMobile', 'sourceOfReference', 'motherTongue',
      ];

      let sectionData: any = {};
      let isValid = true;

      personalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert('Please fill all required fields!', 'danger')
        console.log("Fill data: ", sectionData);
        return;
      }

      let formData = new FormData();
      formData.append('personalInfo', JSON.stringify(sectionData));
      formData.append('moduleId', '1');
      console.log("form alue : ", JSON.stringify(sectionData))

      this.finalSave('emergency', formData);
    }
    if (Action === 'emergency') {
      const personalFields = [
        'relation', 'firstName', 'lastName',
        'contactNumber', 'emergencyAddress', 'emergencyMail',
        'whatsappNumber', 'alternateNumber', 'Nationality', 'religion',
        'knownLanguage', 'alternateMobile', 'sourceOfReference', 'motherTongue',
      ];

      let sectionData: any = {};
      let isValid = true;

      personalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert('Please fill all required fields!', 'danger')
        console.log("Fill data: ", sectionData);
        return;
      }

      let formData = new FormData();
      formData.append('personalInfo', JSON.stringify(sectionData));
      formData.append('moduleId', '1');
      console.log("form alue : ", JSON.stringify(sectionData))

      this.finalSave('bank', formData);
    }
    if (Action === 'bank') {
      const personalFields = [
        'confirmAccNumber', 'bankName', 'ifsc',
        'identificationMarks1', 'identificationMarks2', 'accNumber'
      ];

      let sectionData: any = {};
      let isValid = true;

      personalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert('Please fill all required fields!', 'danger')
        console.log("Fill data: ", sectionData);
        return;
      }

      let formData = new FormData();
      formData.append('personalInfo', JSON.stringify(sectionData));
      formData.append('moduleId', '1');
      console.log("form alue : ", JSON.stringify(sectionData))

      this.finalSave('family', formData);
    }
    if (Action === 'family') {
      const personalFields = [
        'familyDependent', 'familyFirstName', 'familyLastName', 'familyRelation',
        'familyContactNumber', 'familyPhoto', 'familyAadhar', 'familyGender',
        'familyBloodGroup', 'familydob', 'familyAge', 'familyExpired',
        'familyOccupation', 'familyIsPfNominee', 'familyIsGraduityNominee', 'familyStatus'
      ];

      let sectionData: any = {};
      let isValid = true;

      personalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert('Please fill all required fields!', 'danger')
        console.log("Fill data: ", sectionData);
        return;
      }

      let formData = new FormData();
      formData.append('personalInfo', JSON.stringify(sectionData));
      formData.append('moduleId', '1');
      console.log("form alue : ", JSON.stringify(sectionData))

      this.finalSave('agreement', formData);
    }
    if (Action === 'agreement') {
      const control = this.registrationForm.get('agreementDocument');
      if (control?.invalid || this.selectedAgreementDocs.length === 0) {
        control?.markAsTouched();
        this.showAlert('Please upload required documents!', 'danger');
        return;
      }

      let formData = new FormData();
      formData.append('moduleId', '1');

      // Append all selected files
      this.selectedAgreementDocs.forEach((file, index) => {
        formData.append('agreementDocument', file);
        // or: formData.append(`agreementDocument[${index}]`, file);
      });

      console.log("Uploading files:", this.selectedAgreementDocs);

      this.finalSave('medical', formData);
    }
    if (Action === 'medical') {
      const personalFields = [
        'height', 'descriptionForMedical', 'weight',
      ];

      let sectionData: any = {};
      let isValid = true;

      personalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert('Please fill all required fields!', 'danger')
        console.log("Fill data: ", sectionData);
        return;
      }

      let formData = new FormData();
      formData.append('personalInfo', JSON.stringify(sectionData));
      formData.append('moduleId', '1');
      console.log("form alue : ", JSON.stringify(sectionData))

      this.finalSave('medical', formData);
    }


  }


  finalSave(action: string, formData) {
    console.log("final save clicked");
    this.isEmergency = true;
    this.showAlert('Data saved successfully!', 'success');
    // this.authService.hiringRegister(formData).subscribe({
    //   next: (res: any) => {
    //     console.log("Save response:", res);
    //     if (res && res.success) {
    //       this.showAlert('Data saved successfully!', 'success');
    //     } else {
    //       this.showAlert(res.message || 'Error saving data. Please try again.', 'danger');
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     console.error("Error saving data:", err);
    //     this.showAlert('Error saving data. Please try again later.', 'danger');
    //   }
    // });
    this.setActiveSection(action);
    if (action === 'medical') {

      Swal.fire({
        html: `
        <div class="mb-3">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZM9W5m85CN4_xgg6D1yEnJKLArugi2Hx-cA&s" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
        </div>
        <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to move this Candidate?</h5>
        <p class="text-muted mb-0" style="font-size: 14px;">
          This will complete the Hiring process and moving to HRMS.
        </p>
      `,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Move',
        reverseButtons: true,
        customClass: {
          popup: 'p-3 rounded-4',
          htmlContainer: 'text-center',
          actions: 'd-flex justify-content-center',
          cancelButton: 'btn btn-danger btn-sm shadow-none mr-2',
          confirmButton: 'btn btn-success btn-sm shadow-none'
        },
        buttonsStyling: false,
        width: '550px',
        backdrop: true
      }).then((result) => {
        if (result.isConfirmed) {
          const base64Once = btoa(this.empId.toString());
          const base64Twice = btoa(base64Once);
          this.router.navigate(['/employee-code', base64Twice]);
        }
      })

    }
    // if (action === 'personal') {
    //   this.setActiveSection('emergency');
    //   console.log("form value : ", formData);
    // }
    // if (action === 'emergency') {
    //   this.setActiveSection('bank');
    // }
    // if (action === 'bank') {
    //   this.setActiveSection('medical');
    // }
    // if (action === 'medical') {
    //   this.setActiveSection('family');
    //   const base64Once = btoa(this.empId.toString());
    //   const base64Twice = btoa(base64Once);
    //   this.router.navigate(['/employee-code', base64Twice]);
    // }
    // if (action === 'family') {
    //   this.setActiveSection('agreement');
    // }
    // if (action === 'agreement') {
    //   this.setActiveSection('professional');
    // }
    // if (action === 'professional') {
    //   this.setActiveSection('employee');
    // }
  }

  edit(value: string) {
    console.log("edit clicked")
  }
  onStateChange(event: Event, addressType: 'communication' | 'permanent') {
    const selectedStateId = (event.target as HTMLSelectElement).value;

    if (selectedStateId) {
      this.getCities(selectedStateId, addressType);
    }
  }

  getCities(stateId: string, addressType: 'communication' | 'permanent') {
    this.authService.cities(stateId).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          if (addressType === 'communication') {
            this.communicationCities = res;
            this.registrationForm.patchValue({
              cityId: res[0]?.id || null // Automatically patch the first city ID
            });
          } else {
            this.permanentCities = res;
            this.registrationForm.patchValue({
              permanentCityId: res[0]?.id || null // Automatically patch for permanent address
            });
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error fetching cities:", err);
      }
    });
  }

  submit() {
    this.isEmergency = true;
  }

  loadUserData(empId: number) {
    this.isLoading = true;
    this.authService.registeredData(empId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log("User data:", res);
        this.candidateData = res;
        // if (res) {
        //   // Patch form values
        //   this.registrationForm.patchValue({
        //     whatsappNumber: res.whatsappNumber || '',
        //     alternateNumber: res.alternateNumber || '',
        //     Nationality: res.Nationality || 'Indian',
        //     religion: res.religion || '',
        //     motherTongue: res.motherTongue || '',
        //     knownLanguage: res.knownLanguage || '',
        //     alternateMobile: res.alternateMobile || '',
        //     sourceOfReference: res.sourceOfReference || '',

        //     relation: res.relation || '',
        //     firstName: res.firstName || '',
        //     lastName: res.lastName || '',
        //     contactNumber: res.contactNumber || '',
        //     emergencyAddress: res.emergencyAddress || '',
        //     emergencyMail: res.emergencyMail || '',

        //     bankName: res.bankName || '',
        //     ifsc: res.ifsc || '',
        //     accNumber: res.accNumber || '',
        //     confirmAccNumber: res.confirmAccNumber || '',
        //     identificationMarks1: res.identificationMarks1 || '',
        //     identificationMarks2: res.identificationMarks2 || '',

        //     height: res.height || '',
        //     weight: res.weight || '',
        //     descriptionForMedical: res.descriptionForMedical || '',

        //     // family details
        //     // familyFirstName: res.familyFirstName || '',
        //     // familyLastName: res.familyLastName || '',
        //     // familyRelation: res.familyRelation || '',
        //     // familyContactNumber: res.familyContactNumber || '',
        //     // familyPhoto: res.familyPhoto || '',
        //     // familyAadhar: res.familyAadhar || '',
        //     // familyGender: res.familyGender || '',
        //     // familyBloodGroup: res.familyBloodGroup || '',
        //     // familydob: res.familydob || '',
        //     // familyAge: res.familyAge || '',
        //     // familyExpired: res.familyExpired || '',
        //     // familyDependent: res.familyDependent || '',
        //     // familyOccupation: res.familyOccupation || '',
        //     // familyIsPfNominee: res.familyIsPfNominee || '',
        //     // familyIsGraduityNominee: res.familyIsGraduityNominee || '',
        //     // familyStatus: res.familyStatus || '',

        //     // Agreement Documens
        //     // agreementDocument: res.agreementDocument || '',

        //     department: res.department || '',
        //     designation: res.designation || '',
        //     dateOfJoining: res.dateOfJoining || '',
        //     HQ: res.HQ || '',
        //     ishod: res.ishod || '',
        //     firstDay: res.firstDay || '',
        //     reportingManager: res.reportingManager || '',
        //     isExperienced: res.isExperienced || '',
        //     increamentType: res.increamentType || '',
        //   });

        //   // If there are family details as an array, set it to familyData
        //   if (Array.isArray(res.familyDetails) && res.familyDetails.length > 0) {
        //     this.familyData = res.familyDetails;
        //   }

        //   // If there are agreement documents, handle them accordingly
        //   // Assuming res.agreementDocuments is an array of file metadata
        //   // this.selectedAgreementDocs = res.agreementDocuments || [];
        // }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error("Error fetching user data:", err);
        this.showAlert('Error fetching user data. Please try again later.', 'danger');
      }
    });
  }

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  alertType: 'success' | 'danger' = 'success';
  alertMessage: string | null = null;
  private alertTimeout: any;

  private showAlert(message: string, type: 'success' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;

    // const audio = new Audio("assets/img/job-code/mixkit-game-show-wrong-answer-buzz-950.wav");
    // audio.play();


    clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => {
      this.alertMessage = null;

    }, 3000);
  }

  closeAlert() {
    this.alertMessage = null;
  }

  fullSize() {
    this.isFullSize = !this.isFullSize;
  }

  //   selectedAgreementDocs: File[] = [];

  // onFileSelect(event: any): void {
  //   const files: FileList = event.target.files;

  //   if (files && files.length > 0) {
  //     this.selectedAgreementDocs = Array.from(files);

  //     // Update hidden form control manually
  //     this.registrationForm.get('agreementDocument')?.setValue(this.selectedAgreementDocs);
  //     this.registrationForm.get('agreementDocument')?.markAsTouched();
  //     this.registrationForm.get('agreementDocument')?.updateValueAndValidity();
  //   } else {
  //     this.selectedAgreementDocs = [];
  //     this.registrationForm.get('agreementDocument')?.reset();
  //   }
  // }
  selectedAgreementDocs: File[] = [];

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedAgreementDocs = Array.from(input.files);

      // Store only metadata in form (so it won't become [{}])
      const fileMetadata = this.selectedAgreementDocs.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      this.registrationForm.get('agreementDocument')?.setValue(fileMetadata);
      this.registrationForm.get('agreementDocument')?.markAsTouched();
      this.registrationForm.get('agreementDocument')?.updateValueAndValidity();
    } else {
      this.selectedAgreementDocs = [];
      this.registrationForm.get('agreementDocument')?.reset();
    }
  }

  deleteFamilyMember(index: number) {
    Swal.fire({
      html: `
       <div class="mb-3">
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZM9W5m85CN4_xgg6D1yEnJKLArugi2Hx-cA&s" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
       </div>
       <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to delete this Candidate?</h5>
       <p class="text-muted mb-0" style="font-size: 14px;">
         This will delete the candidate data.
       </p>
     `,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      reverseButtons: true,
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        actions: 'd-flex justify-content-center',
        cancelButton: 'btn btn-warning text-white btn-sm shadow-none mr-2',
        confirmButton: 'btn btn-danger btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.familyData.splice(index, 1);
      }
    })
  }

  formEnabled = false;  // initially hidden/disabled

  enableFamilyForm() {
    this.formEnabled = true;
  }

  closeOffcanvas() {
    this.isOpen = false;
    this.selectedMemberIndex = null;
  }

  saveFamily() {
    if (this.familyForm.valid && this.selectedMemberIndex !== null) {
      console.log('Form Values:', this.familyForm.value);

      this.familyData[this.selectedMemberIndex] = {
        ...this.familyData[this.selectedMemberIndex],
        ...this.familyForm.value
      };
      this.closeOffcanvas();
    } else {
      console.log('Form is invalid');
    }
  }


  editFamily(member: any) {
    this.selectedMemberIndex = this.familyData.indexOf(member);
    this.familyForm.patchValue(member);  // patch existing data
    this.isOpen = true;
  }


}
