import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-appendices',
  templateUrl: './appendices.component.html',
  styleUrls: ['./appendices.component.sass']
})
export class AppendicesComponent implements OnInit {
  employeeForm: FormGroup;
  searchForm: FormGroup;
  alertMessage: string | null = null;
  private panAlertTimeout: any;
  isLoading: boolean = true;
  colorTheme = 'theme-dark-blue';
  maxDate: Date;
  empId: number | null = null;
  titleList: any[] = [];
  genderList: any[] = [];
  maritalStatusList: any[] = [];
  universityList: any[] = [];
  joiningTimeList: any[] = [];
  educationLevelList: any[] = [];
  statesList: any[] = [];
  bloodGroupList: any[] = [];
  businessUnitsList: any[] = [];
  managersList: any[] = [];
  employeeDataList: any[] = [];
  costCenterList: any[] = [];
  ptStatesList: any[] = [];
  salesDistrictList: any[] = [];
  salesOfficeList: any[] = [];
  salesGroupList: any[] = [];
  probationPeriodList: any[] = [];
  showEmployeeCodeHighlight = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      // employeeIdType: ['system', Validators.required],
      genderId: ['', Validators.required],
      titleId: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z ]+$/)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z ]+$/)]],
      fullName: [{ value: '', disabled: true }],
      division: ['', Validators.required],
      costCenter: ['', Validators.required],
      costDigit: ['', Validators.required],
      dob: ['', Validators.required],
      // status: ['1', Validators.required],
      doj: ['', Validators.required],
      // reason: ['', Validators.required],
      // actionDate: [{ value: new Date(), disabled: true }, Validators.required],
      employmentType: ['', Validators.required],
      ptState: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
      employeeCode: [''],
      probationPeriod: ['', Validators.required],
      joiningTime: ['', Validators.required],
      offerLetterDate: ['', Validators.required],
      ctc: ['', [Validators.required, Validators.pattern(/^[\d,.]+$/)]],
      reportingOfficer: ['', Validators.required],
      salesState: [''],
      salesGroup: [''],
      salesOffice: ['', Validators.required]
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
        } catch (error) {
          console.error('Error decoding encoded ID:', error);
          this.empId = null;
        }
      } else {
        this.empId = null;
      }
    });


    this.loadUserData();

    this.gender();
    this.title();
    this.joiningTime();
    this.masterBu();
    this.listOfManagers();
    this.employeeList();
    this.ptStates();
    this.salesDistrict();
    this.salesOffice();
    this.probationPeriod();
    this.setupFullNameAutoUpdate();


    this.searchForm = this.fb.group({
      BU: [''],
      empId: ['', Validators.required],
      FLName: [''],
      dateOfJoin: [''],
      empType: [''],
      department: [''],
      status: ['']
    });
  }

  loadUserData() {
    this.isLoading = true;
    const empId = this.empId
    this.authService.registeredData(empId).subscribe({
      next: (res: any) => {
        console.log("res : ", res);
        if (res.finalStatus === 'Pending') {
          this.showAlert("Candidate not Found!", 'danger');
          this.isLoading = false;
          return;
        }

        if (res?.candidateOnboardingDTO?.buId) {
          this.costCenter(res?.candidateOnboardingDTO?.buId);
        }
        this.employeeForm.patchValue({
          firstName: res?.candidatePersonalInformationDetails?.firstName || '',
          // fullName: res?.candidatePersonalInformationDetails?.callName || '',
          email: res?.candidatePersonalInformationDetails?.email || '',
          mobileNumber: res?.candidatePersonalInformationDetails?.mobileNumber || '',
          middleName: res?.candidatePersonalInformationDetails?.middleName || '',
          lastName: res?.candidatePersonalInformationDetails?.lastName || '',
          maritalStatusId: res?.candidatePersonalInformationDetails?.maritalStatusId || '',
          bloodGroupId: res?.candidatePersonalInformationDetails?.bloodGroupId || '',
          genderId: res?.candidatePersonalInformationDetails?.genderId || '',
          titleId: res?.candidatePersonalInformationDetails?.titleId || '',
          dob: this.dobFormat(res?.candidatePersonalInformationDetails?.dob) || '',
          doj: this.dobFormat(res?.candidateOnboardingDTO?.joiningDate) || '',
          offerLetterDate: this.dobFormat(res?.candidateOnboardingDTO?.joiningDate) || '',
          fatherName: res?.candidatePersonalInformationDetails?.fatherName || '',
          ctc: res?.candidateOnboardingDTO?.expectedCtc || '',
          division: res?.candidateOnboardingDTO?.buId || '',
          reportingOfficer: res?.candidateOnboardingDTO?.reportingId || '',
          passport: res?.candidatePersonalInformationDetails?.passport || '',
          uan: res?.candidatePersonalInformationDetails?.uan || '',
          district: res?.candidatePersonalInformationDetails?.district || '',
          licence: res?.candidatePersonalInformationDetails?.licence || '',
          pan: res?.candidatePersonalInformationDetails?.pan || '',
          adhar: res?.candidatePersonalInformationDetails?.adhar || '',
          photo: res?.candidatePersonalInformationDetails?.image || '',

          // Communication Address
          addressA: res?.candidateCommunicationAddressDetails?.comAddressA || '',
          addressB: res?.candidateCommunicationAddressDetails?.comAddressB || '',
          addressC: res?.candidateCommunicationAddressDetails?.comAddressC || '',
          stateId: res?.candidateCommunicationAddressDetails?.stateId || '',
          cityId: res?.candidateCommunicationAddressDetails?.cityId || '',
          postalCode: res?.candidateCommunicationAddressDetails?.postalCode,
          addressFlag: res?.candidateCommunicationAddressDetails?.addressFlag || 'no',

          // Permanent Address
          permanentAddressA: res?.candidatePermanentAddressDetails?.perAddressA || '',
          permanentAddressB: res?.candidatePermanentAddressDetails?.perAddressB || '',
          permanentAddressC: res?.candidatePermanentAddressDetails?.perAddressC || '',
          permanentStateId: res?.candidatePermanentAddressDetails?.stateId || '',
          permanentCityId: res?.candidatePermanentAddressDetails?.cityId || '',
          permanentPostalCode: res?.candidatePermanentAddressDetails?.postalCode,

          joiningTime: res?.candidateExperienceDetails?.candidateJoiningDetails?.joiningId || '',
          currentSalary: res?.candidateExperienceDetails?.candidateSalaryDetails?.currentSalary || '',
          expectedSalary: res?.candidateExperienceDetails?.candidateSalaryDetails?.expectedSalary || '',
          suitableJobDescription: res?.candidateExperienceDetails?.candidateSalaryDetails?.description || '',
        });
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err);
        this.isLoading = false;
      }
    })
  }

  setupFullNameAutoUpdate() {
    this.employeeForm.get('firstName')!.valueChanges.subscribe(() => this.updateFullName());
    this.employeeForm.get('middleName')!.valueChanges.subscribe(() => this.updateFullName());
    this.employeeForm.get('lastName')!.valueChanges.subscribe(() => this.updateFullName());
  }

  updateFullName() {
    const first = this.employeeForm.get('firstName')!.value || '';
    const middle = this.employeeForm.get('middleName')!.value || '';
    const last = this.employeeForm.get('lastName')!.value || '';
    const full = [first, middle, last].filter(v => v).join(' ');
    this.employeeForm.get('fullName')!.setValue(full.toUpperCase(), { emitEvent: false });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Submitted:', this.employeeForm.value);
      Swal.fire({
        html: `
         <div class="mb-3">
           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZM9W5m85CN4_xgg6D1yEnJKLArugi2Hx-cA&s" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
         </div>
         <h5 class="mb-2" style="font-weight: bold;">Confirm employee code generation?</h5>
         <p class="text-muted mb-0" style="font-size: 14px;">
           This will finalize the generation of the employee code.
         </p>
       `,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Generate',
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
          Swal.fire({
            html: `
              <div class="mb-3">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZM9W5m85CN4_xgg6D1yEnJKLArugi2Hx-cA&s" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
              </div>
              <h5 class="mb-2" style="font-weight: bold;">Canidate Employee ID : 13431</h5>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Save',
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
              this.showAlert('Successfully completed submission', 'success');
              this.showEmployeeCodeHighlight = true;
              this.employeeForm.patchValue({
                employeeCode: '13431'
              });
              setTimeout(() => {
                this.employeeForm.patchValue({ employeeCode: '13431' });
                this.showEmployeeCodeHighlight = false;
                const base64Once = btoa(this.empId.toString());
                const base64Twice = btoa(base64Once);
                this.router.navigate(['/onboarding-data', base64Twice]);
              }, 3000);
            }
          });

        }
      });

    } else {
      this.employeeForm.markAllAsTouched();
      console.log("form value : ", this.employeeForm?.value);
      this.showAlert('Please fill required fields', 'danger');
    }
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const data = this.searchForm.getRawValue();
      console.log('Search criteria:', data.empId);
      if (data.empId === this.empId) {
        this.showAlert("Same Employee Choosen", 'success');
        return;
      }
      this.reset();
      this.empId = data.empId;
      this.loadUserData();
      // your API call or search logic here
    } else {
      this.searchForm.markAllAsTouched();
    }
  }

  checkList() {
    this.showAlert("Need to display all details about candidate", 'success')
  }


  dobFormat(dobStr: string | null | undefined): Date | '' {
    if (!dobStr) return '';

    const [dd, mm, yyyy] = dobStr.split('-');
    const day = Number(dd);
    const month = Number(mm) - 1; // JS months are 0-based
    const year = Number(yyyy);

    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      day < 1 || day > 31 || month < 0 || month > 11 || year < 1000
    ) {
      return '';
    }

    return new Date(year, month, day);
  }

  reset() {
    // this.showAlert('Reset all filled data as well.', 'danger');
    this.employeeForm.reset({
      // employeeIdType: 'system',
      genderId: '',
      titleId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      fullName: '',
      division: '',
      costCenter: '',
      costDigit: '',
      dob: '',
      doj: '',
      reason: '',
      status: '1',
      employmentType: '1',
      ptState: '',
      mobileNumber: '',
      email: '',
      employeeCode: '',
      probationPeriod: '',
      joiningTime: '',
      offerLetterDate: '',
      ctc: '',
      reportingOfficer: '',
      salesState: '',
      salesOffice: '',
      salesGroup: '',
      actionDate: new Date()
    });
  }

  alertType: 'success' | 'danger' = 'success';

  private showAlert(message: string, type: 'success' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;


    clearTimeout(this.panAlertTimeout);
    this.panAlertTimeout = setTimeout(() => {
      this.alertMessage = null;
    }, 2000);
  }

  closeAlert() {
    this.alertMessage = null;
  }

  gender() {
    this.authService.gender().subscribe({
      next: (res: any) => {
        this.genderList = res;
      }
    })
  }

  title() {
    this.authService.title().subscribe({
      next: (res: any) => {
        this.titleList = res;
      },
      error: (err: HttpErrorResponse) => {
      }
    })
  }

  joiningTime() {
    this.authService.joiningTime().subscribe({
      next: (res: any) => {
        this.joiningTimeList = res;
      },
      error: (err: HttpErrorResponse) => {
      }
    })
  }

  masterBu() {
    this.authService.masterBu().subscribe({
      next: (res: any[]) => {
        this.businessUnitsList = [...res];
      },
      error: (err) => {
        console.error('Error fetching business unit data:', err);
      },
    });
  }

  listOfManagers(): void {
    this.authService.ReportingManagers().subscribe({
      next: (res) => {
        this.managersList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  employeeList() {
    this.authService.employeeList().subscribe({
      next: (res) => {
        this.employeeDataList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  ptStates() {
    this.authService.ptStates().subscribe({
      next: (res) => {
        this.ptStatesList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  onBusinessUnitChange(event: any) {
    const selectedId = event.target.value;
    const selectedItem = this.businessUnitsList.find(item => item.id == selectedId);
    console.log("selected item : ", selectedItem.id);
    this.costCenter(selectedItem.id)

  }

  costCenter(id: any) {
    this.authService.costCenterList(id).subscribe({
      next: (res) => {
        this.costCenterList = res;
        this.employeeForm.get('costCenter')?.setValue('');
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  salesDistrict() {
    this.authService.salesDistrict().subscribe({
      next: (res) => {
        this.salesDistrictList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  salesOffice() {
    this.authService.salesOffice().subscribe({
      next: (res: any) => {
        this.salesOfficeList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  onSalesOfficeChange(event: any) {
    const selectedId = event.target.value;
    this.salesGroup(selectedId);
  }


  salesGroup(id: any) {
    this.authService.salesGroup(id).subscribe({
      next: (res) => {
        this.salesGroupList = res;
        this.employeeForm.get('salesGroup')?.setValue('');
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching sales group:", err);
      }
    });
  }

  probationPeriod() {
    this.authService.probationPeriod().subscribe({
      next: (res: any) => {
        this.probationPeriodList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }



}
