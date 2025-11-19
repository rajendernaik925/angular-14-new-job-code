import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-onboarding-data',
  templateUrl: './onboarding-data.component.html',
  styleUrls: ['./onboarding-data.component.sass']
})
export class OnboardingDataComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('hiddenTenthInput') hiddenTenthInput!: ElementRef;
  @ViewChild('hiddenAadharInput') hiddenAadharInput!: ElementRef;
  @ViewChild('hiddenAgreementInput') hiddenAgreementInput!: ElementRef;
  @ViewChild('hiddenPanInput') hiddenPanInput!: ElementRef;
  @ViewChild('hiddenTwelthInput') hiddenTwelthInput!: ElementRef;
  @ViewChild('hiddenDegreeOrBTechInput') hiddenDegreeOrBTechInput!: ElementRef;
  @ViewChild('hiddenDeplomaInput') hiddenDeplomaInput!: ElementRef;
  @ViewChild('hiddenOthersInput') hiddenOthersInput!: ElementRef;

  registrationForm: FormGroup;
  logo: string = 'https://sso.heterohealthcare.com/iconnect/assets/img/logo.svg';
  universityOptions: any[] = [];
  educationLevelOptions: any[] = [];
  qualificationOptions: any[] = [];
  branchOptions: any[] = [];
  existingEducationList: any[] = [];
  currentYear = new Date().getFullYear();
  years = Array.from({ length: 100 }, (_, i) => this.currentYear - i);
  activeTab: string = 'personal'
  showCommunicationAddress: boolean = false;
  isFresher: boolean = true;
  jobCodeData: any;
  personalInfoArray: any[] = [];
  selectedFiles: { [key: string]: File } = {};
  titleOptions: any[] = [];
  genderOptions: any[] = [];
  marriatalStatusOptions: any[] = [];
  joiningOptions: any[] = [];
  bloodGroupOptions: any[] = [];
  languageOptions: any[] = [];
  religionOptions: any[] = [];
  relationOptions: any[] = [];
  bankOptions: any[] = [];
  yesNoOptions: any[] = [];
  statusOptions: any[] = [];
  managersListOptions: any[] = [];
  businessUnitsListOptions: any[] = [];
  departmentListOptions: any[] = [];
  designationListOptions: any[] = [];
  employeeDataListOptions: any[] = [];
  ptStatesListOptions: any[] = [];
  salesOfficeListOptions: any[] = [];
  salesGroupListOptions: any[] = [];
  salesDistrictListOptions: any[] = [];
  increamentTypeList: any[] = [];
  workLocationList: any[] = [];
  probationPeriodList: any[] = [];
  hodNameList: any[] = [];
  costCenterList: any[] = [];
  indianStates: any[] = [];
  communicationCities: any[] = [];
  permanentCities: any[] = [];
  experienceArray: any[] = [];
  FamilyInfoData: any[] = [];
  isSidebarOpen: boolean = false;
  isLoading: boolean = false;
  isUpdateMode: boolean = false;
  isAllDataPresent: boolean = false;
  isEmergencyDataPresent: boolean = false;
  isBankDataPresent: boolean = false;
  isMedicalDataPresent: boolean = false;
  isProfessionalDataPresent: boolean = false;
  isHrmsDataPresent: boolean = false;
  emergencyUpdate: boolean = false;
  bankUpdate: boolean = false;
  medicalUpdate: boolean = false;
  professionalUpdate: boolean = false;
  hrmsUpdate: boolean = false;
  isExperienceBoolean: boolean = false;
  isAllAddressDataPresent: boolean = false;
  personalUpdate: boolean = false;
  experienceUpdate: boolean = false;
  addressUpadte: boolean = false;
  colorTheme = 'theme-dark-blue';
  hovering = false;
  statusPercentage: number = 50;
  loadedData: any;
  editButtonDisplay: boolean = true;
  resumeFile: string | null = null;
  photoFile: string | null = null;
  tenthFile: string | null = null;
  twelthFile: string | null = null;
  aadharFile: string | null = null;
  agreementFile: string | null = null;
  MedicalReportFile: string | null = null;
  familyPhotoFile: string | null = null;
  familyAadharFile: string | null = null;
  bankFile: string | null = null;
  panFile: string | null = null;
  deplomaFile: string | null = null;
  degreeOrBTechFile: string | null = null;
  othersFile: string | null = null;
  fileURL: SafeResourceUrl | null = null;
  showPDF: boolean = false;
  updateDocumentFlag: boolean = false;
  deleteStatus: true;
  payslipFile!: File;
  serviceLetterFile!: File;
  serviceFilePath: string | null = '';
  paySlipFilePath1: string | null = '';
  paySlipFilePath2: string | null = '';
  paySlipFilePath3: string | null = '';
  showSidebar = false;
  today: Date = new Date();
  maxDate: Date;
  selectedPayslip1FileName: string = 'Upload Payslip 1';
  selectedServiceLetterFileName: string = 'Upload Service Letter';
  hasExperince: boolean = false;
  experienceId: any;
  uploadResume: string = 'Upload Resume';
  uploadPhoto: string = 'Upload Photo';
  uploadBankFile: string = 'Upload bank passbook';
  uploadFamilyAadharFile: string = 'Upload Aadhar';
  uploadFamilyPhotoFile: string = 'Upload Family Photo';
  uploadMedicalFile: string = 'Upload Mecical Report';
  alertMessage: string | null = null;
  private panAlertTimeout: any;
  empId: any | null = null;
  bankFileError: string | null = null;
  medicalFileError: string | null = null;
  familyAadharFileError: string | null = null;
  searchEmpId: string = '';
  userData: any;
  loginId: number | null = null;
  costCenterDisableVlaue: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {
    this.registrationForm = this.fb.group({
      // educationDetails: this.fb.array([this.createEducationFormGroup()]),
      jobCodeId: [{ value: '', disabled: false }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      maritalStatusId: ['', Validators.required],
      genderId: ['', Validators.required],
      titleId: ['', Validators.required],
      dob: ['', Validators.required],
      fatherName: ['', Validators.required],
      passport: [''],
      uan: [''],
      licence: [''],
      bloodGroupId: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      district: ['', Validators.required],
      // pan: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      pan: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]],
      adhar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      whatsappNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      alternateMobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nationality: ['1', Validators.required],
      religion: ['', Validators.required],
      motherTongue: ['', Validators.required],
      knownLanguages: [[], Validators.required],
      resume: [''],
      photo: [''],
      // address
      addressA: ['', Validators.required],
      addressB: ['', Validators.required],
      addressC: [''],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressFlag: ['no', Validators.required],
      permanentAddressA: ['', Validators.required],
      permanentAddressB: ['', Validators.required],
      permanentAddressC: [''],
      permanentStateId: ['', Validators.required],
      permanentCityId: ['', Validators.required],
      permanentPostalCode: ['', Validators.required],
      // education
      educationTypeId: ['', Validators.required],
      university: ['', Validators.required],
      qualification: ['', Validators.required],
      yearOfPassing: ['', Validators.required],
      percentage: ['', Validators.required],

      educationId: [null],
      educationLevelId: ['', Validators.required],
      universityId: ['', Validators.required],
      branch: [''],
      college: ['', Validators.required],


      //documents
      tenth: [],
      twelth: [],
      panFile: [],
      aadharFile: [],
      deploma: [],
      degreeOrBTech: [],
      others: [],
      //experience
      isFresher: ['fresher', Validators.required],
      joiningTime: ['', Validators.required],
      companyName: ['', Validators.required],
      totalExperience: ['', Validators.required],
      LastOrStill_Working_Date: ['', Validators.required],
      payslipFile1: [null, Validators.required],
      payslipFile2: [null, Validators.required],
      payslipFile3: [null, Validators.required],
      serviceLetterFile: [null],
      //salary
      currentSalary: ['', Validators.required],
      expectedSalary: ['', Validators.required],
      suitableJobDescription: ['', Validators.required],


      // emergency
      relationId: ['', Validators.required],
      emergencyFirstname: ['', Validators.required],
      emergencyLastname: ['', Validators.required],
      emergencyContact: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      emergencyEmail: ['', [Validators.required, Validators.email]],
      completeaAddress: ['', Validators.required],

      // bank
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      confirmAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      bankName: ['', Validators.required],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      identificationMarkA: ['', Validators.required],
      identificationMarkB: ['', Validators.required],

      // family details 
      familyRelationId: ['', Validators.required],
      familyFirstName: ['', Validators.required],
      familyLastName: ['', Validators.required],
      familyDOB: ['', Validators.required],
      familyContact: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      familyGender: ['', [Validators.required]],
      familyBloodGroup: ['', [Validators.required]],
      familyIsdependent: ['', [Validators.required]],
      familyIsExpired: ['', [Validators.required]],
      familyIsPFNominee: ['', [Validators.required]],
      familyIsGraduityNominee: ['', [Validators.required]],
      familyOccupation: ['', [Validators.required]],
      familyAge: ['', Validators.required],
      familyStatus: ['', Validators.required],


      // medical
      medicalDescription: ['', [Validators.required, Validators.minLength(10)]],

      // professional information 
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      workLocation: ['', [Validators.required]],
      // ishod: ['', [Validators.required]],
      reportingManager: ['', [Validators.required]],
      // paysheetGroup: ['', [Validators.required]],
      incrementType: ['', [Validators.required]],
      businessUnit: ['', [Validators.required]],
      hodName: ['', [Validators.required]],

      // HRMS
      noticePeriod: ['', [Validators.required]],
      probationPeriod: ['', [Validators.required]],
      employeeType: ['', [Validators.required]],
      division: ['', [Validators.required]],
      ptState: ['', [Validators.required]],
      costCenter: ['', [Validators.required]],
      costDigit: ['', [Validators.required]],
      saleState: ['', [Validators.required]],
      saleHQ: ['', [Validators.required]],
      saleGroup: ['', [Validators.required]],
      CTC: ['', [Validators.required]],
      dateAsPerLetter: ['', [Validators.required]],
      FirstDay: ['', [Validators.required]],

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

    this.activeTab = 'personal'
    this.handleExperienceToggle('fresher');


    if (this.empId) {
      this.loadUserData();
    }

    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);
    this.loginId = this.userData.user.empID;

    this.title();
    this.gender();
    this.marriageStatus();
    this.university();
    this.educationLevel();
    this.joiningTime();
    this.states();
    this.bloodGroup();
    this.languages();
    this.religion();
    this.relation();
    this.banks();
    this.loadYesNoOptions();
    this.status();



    // list
    // this.joiningTime();
    this.masterBu();
    this.listOfManagers();
    this.totalDepartments();
    this.designation();
    this.employeeList();
    this.ptStates();
    this.salesDistrict();
    this.salesOffice();
    this.probationPeriod();
    this.workLocation();
    this.increamentType();
  }

  // toggleSidebar() {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }


  closeSidebar() {
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  loadUserData() {
    // if (!this.empId) {
    //   console.warn("emp id not getting");
    //   return;
    // }

    this.isLoading = true;
    this.authService.registeredData(this.empId).subscribe({
      next: (res: any) => {
        this.loadedData = res;
        this.isLoading = false;
        this.jobCodeData = res;
        console.log("result : ", res);
        if (this.loadedData?.candidateTrackingDTO?.totalPercentage === '100' && !this.loadedData?.candidateInterviewDetails?.length) {
          // this.completedStatus();
        }
        if (res?.fetchingEmployeeMoveToHrmsDTO?.salesOfficeCode) {
          // this.editButtonDisplay = false;
          // this.InterviewStatus();
        }

        if (res?.candidateOnboardingDTO?.reportingId) {
          this.hodName(res?.candidateOnboardingDTO?.reportingId);
        }

        if (res?.candidateOnboardingDTO?.buId) {
          this.costCenter(res?.candidateOnboardingDTO?.buId);
        }

        console.log("cost center : ", res?.fetchingEmployeeMoveToHrmsDTO?.costCenterId)

        if (res?.fetchingEmployeeMoveToHrmsDTO?.division) {
          this.costCenter(res?.fetchingEmployeeMoveToHrmsDTO?.division);
        }

        if (res?.fetchingEmployeeMoveToHrmsDTO?.costCenterId) {
          this.costCenter(res?.fetchingEmployeeMoveToHrmsDTO?.costCenterId);
        }

        if (res?.familyInformationResponseDTO) {
          this.FamilyInfoData = res?.familyInformationResponseDTO;
        }

        this.hasExperince = !res?.candidateExperienceDetails?.candidateJoiningDetails?.is_Fresher;
        this.experienceId = res?.candidateExperienceDetails?.candidateJoiningDetails?.experienceId;
        console.log("education details : ", res.candidateEducationDetails);
        this.existingEducationList = res.candidateEducationDetails;


        // console.log("rajender : ",res.candidatePersonalInformationDetails.candidateInterviewDetails)
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
          // console.log("Registered Data:", res?.candidateCommunicationAddressDetails?.postalCode);

          this.resumeFile = this.loadedData?.candidatePersonalInformationDetails?.resumeFile || null;

          this.photoFile = res?.candidatePersonalInformationDetails?.imageFile || null;
          this.tenthFile = res?.candidateDocumentDetails?.tenthFile || null;
          this.aadharFile = res?.candidateDocumentDetails?.aadharFile || null;
          this.bankFile = res?.bankDetailsDTO?.bankFilePath || null;
          this.agreementFile = res?.agreementFileDTO?.agreementFile || null;
          this.MedicalReportFile = res?.medicalDocumentDTO?.medicalDocumentData || null;
          this.panFile = res?.candidateDocumentDetails?.panFile || null;
          this.twelthFile = res?.candidateDocumentDetails?.intermediateFile || null;
          this.deplomaFile = res?.candidateDocumentDetails?.pgFile || null;
          this.degreeOrBTechFile = res?.candidateDocumentDetails?.degreeFile || null;
          this.othersFile = res?.candidateDocumentDetails?.otherFile || null;

          this.paySlipFilePath1 = res?.candidateExperienceDetails?.candidateSalaryDetails?.paySlipFileA || null;
          this.paySlipFilePath2 = res?.candidateExperienceDetails?.candidateSalaryDetails?.paySlipFileB || null;
          this.paySlipFilePath3 = res?.candidateExperienceDetails?.candidateSalaryDetails?.paySlipFileC || null;
          this.serviceFilePath = res?.candidateExperienceDetails?.candidateSalaryDetails?.serviceFile || null;

          //this.isFresher = res?.candidateExperienceDetails?.candidateJoiningDetails?.is_Fresher ? 'fresher' : 'experienced';
          const isFresher =
            res?.candidateExperienceDetails?.candidateJoiningDetails !== null
              ? (res?.candidateExperienceDetails?.candidateJoiningDetails?.is_Fresher ? 'fresher' : 'experienced')
              : (res?.candidatePersonalInformationDetails?.isFresher ? 'fresher' : 'experienced');


          // const isFreshers = res?.candidateExperienceDetails?.candidateJoiningDetails === null ? (res?.candidateExperienceDetails ? 'fresher' : 'experienced')
          // : (res?.candidatePersonalInformationDetails?.isFresher ? 'fresher' : 'experienced');

          this.experienceArray = res?.candidateExperienceDetails?.candidateCompanyDetails || [];

          // Patch form data
          this.registrationForm.patchValue({
            firstName: res?.candidatePersonalInformationDetails?.firstName ? res.candidatePersonalInformationDetails.firstName : this.jobCodeData.name,
            mobileNumber: res?.candidatePersonalInformationDetails?.mobileNumber ? res.candidatePersonalInformationDetails.mobileNumber : this.jobCodeData.mobileNumber,
            jobCodeId: res?.candidatePersonalInformationDetails?.jcReferanceId ? res.candidatePersonalInformationDetails.jcReferanceId : this.jobCodeData.jcReferanceId,
            email: res?.candidatePersonalInformationDetails?.email ? res.candidatePersonalInformationDetails.email : this.jobCodeData.email,
            middleName: res?.candidatePersonalInformationDetails?.middleName || '',
            lastName: res?.candidatePersonalInformationDetails?.lastName || '',
            maritalStatusId: res?.candidatePersonalInformationDetails?.maritalStatusId || '',
            bloodGroupId: res?.candidatePersonalInformationDetails?.bloodGroupId || '',
            genderId: res?.candidatePersonalInformationDetails?.genderId || '',
            titleId: res?.candidatePersonalInformationDetails?.titleId || '',
            dob: this.dobFormat(res?.candidatePersonalInformationDetails?.dob) || '',
            fatherName: (res?.candidatePersonalInformationDetails?.fatherName || '').trim() || '',
            passport: res?.candidatePersonalInformationDetails?.passport || '',
            uan: res?.candidatePersonalInformationDetails?.uan || '',
            district: (res?.candidatePersonalInformationDetails?.district || '').trim() || '',
            licence: res?.candidatePersonalInformationDetails?.licence || '',
            pan: (res?.candidatePersonalInformationDetails?.pan || '').trim() || '',
            adhar: res?.candidatePersonalInformationDetails?.adhar || '',
            photo: res?.candidatePersonalInformationDetails?.image || '',
            whatsappNumber: res?.candidatePersonalInformationDetails?.whatsappNumber || '',
            alternateMobileNumber: res?.candidatePersonalInformationDetails?.alternateMobileNumber || '',
            religion: res?.candidatePersonalInformationDetails?.religion || '',
            motherTongue: res?.candidatePersonalInformationDetails?.motherTongueId || '',
            // knownLanguages: res?.candidatePersonalInformationDetails?.knownLanguages[0].id || '',
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

            // emergency Details
            relationId: res?.emergencyContactDetailsDTO?.relationId || '',
            emergencyFirstname: res?.emergencyContactDetailsDTO?.firstName || '',
            emergencyLastname: res?.emergencyContactDetailsDTO?.lastName || '',
            emergencyContact: res?.emergencyContactDetailsDTO?.contactNumber || '',
            emergencyEmail: res?.emergencyContactDetailsDTO?.email || '',
            completeaAddress: res?.emergencyContactDetailsDTO?.address || '',

            // bank details
            accountNumber: res?.bankDetailsDTO?.accountNumber || '',
            confirmAccountNumber: res?.bankDetailsDTO?.accountNumber || '',
            bankName: res?.bankDetailsDTO?.bankId || '',
            ifscCode: res?.bankDetailsDTO?.ifscCode || '',
            identificationMarkA: res?.bankDetailsDTO?.identificationMarkA || '',
            identificationMarkB: res?.bankDetailsDTO?.identificationMarkB || '',

            // professional
            department: res?.candidatePersonalInformationDetails?.departmentId || '',
            designation: res?.candidatePersonalInformationDetails?.designationId || '',
            reportingManager: res?.candidateOnboardingDTO?.reportingId || '',
            businessUnit: res?.candidateOnboardingDTO?.buId || '',
            hodName: res?.candidateOnboardingDTO?.reportingPersonName || '',

            // medical Report
            medicalDescription: res?.medicalDocumentDTO?.description || '',

            // professional
            workLocation: res?.professionalInformationDTO?.workLocationId || '',
            incrementType: res?.professionalInformationDTO?.incrementTypeId || '',

            // HRMS
            CTC: res?.candidateOnboardingDTO?.expectedCtc || '',
            division: res?.fetchingEmployeeMoveToHrmsDTO?.division ? res?.fetchingEmployeeMoveToHrmsDTO?.division : res?.candidateOnboardingDTO?.buId || '',
            // division: res?.candidateOnboardingDTO?.buId || '',
            FirstDay: res?.candidateOnboardingDTO?.joiningDate || '',
            dateAsPerLetter: res?.candidateOnboardingDTO?.offerLetterSentDate || '',
            noticePeriod: res?.candidateExperienceDetails?.candidateJoiningDetails?.joiningId || '',
            costCenter: res?.fetchingEmployeeMoveToHrmsDTO?.costCenterId || '',
            // costDigit: res?.fetchingEmployeeMoveToHrmsDTO?.costDigit || '',
            probationPeriod: res?.fetchingEmployeeMoveToHrmsDTO?.probationId || '',
            employeeType: res?.fetchingEmployeeMoveToHrmsDTO?.employeeType || '',
            ptState: res?.fetchingEmployeeMoveToHrmsDTO?.ptStateCode || '',
            saleState: res?.fetchingEmployeeMoveToHrmsDTO?.saleDistrict || '',

            saleHQ: res?.fetchingEmployeeMoveToHrmsDTO?.salesOfficeCode || '',
            saleGroup: res?.fetchingEmployeeMoveToHrmsDTO?.salesGroupCode || '',

            // Experience Details
            isFresher: isFresher,
            joiningTime: res?.candidateExperienceDetails?.candidateJoiningDetails?.joiningId || '',
            currentSalary: res?.candidateExperienceDetails?.candidateSalaryDetails?.currentSalary || '',
            expectedSalary: res?.candidateExperienceDetails?.candidateSalaryDetails?.expectedSalary || '',
            suitableJobDescription: res?.candidateExperienceDetails?.candidateSalaryDetails?.description || '',
          });



          if (res?.candidateCommunicationAddressDetails?.postalCode) {
            this.getCities(
              res?.candidateCommunicationAddressDetails?.stateId,
              'communication',
              res?.candidateCommunicationAddressDetails?.cityId
            );
          }

          if (res?.candidatePermanentAddressDetails?.postalCode) {
            this.getCities(
              res?.candidatePermanentAddressDetails?.stateId,
              'permanent',
              res?.candidatePermanentAddressDetails?.cityId
            );
          }

          this.isAllDataPresent = [res?.candidatePersonalInformationDetails?.fatherName]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isEmergencyDataPresent = [res?.emergencyContactDetailsDTO?.firstName]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isBankDataPresent = [res?.bankDetailsDTO?.accountNumber]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isMedicalDataPresent = [res?.medicalDocumentDTO?.description]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isProfessionalDataPresent = [res?.professionalInformationDTO?.workLocationName]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isHrmsDataPresent = [res?.fetchingEmployeeMoveToHrmsDTO?.costCenterId]
            .every(field => typeof field === 'string' && field.trim() !== '');


          this.isAllAddressDataPresent = [res?.candidateCommunicationAddressDetails?.comAddressA]
            .every(field => typeof field === 'string' && field.trim() !== '');

          this.isExperienceBoolean = res?.candidateExperienceDetails?.candidateJoiningDetails?.experienceId;

          this.handleExperienceToggle(isFresher);


          // Handle Education Details
          // if (res?.candidateEducationDetails?.length) {
          //   res.candidateEducationDetails.forEach((educationData: any) => {
          //     this.educationArray.push(this.createEducationFormGroup(educationData));
          //   });
          // }

          // if (res?.candidateEducationDetails?.length) {
          //   res.candidateEducationDetails.forEach((educationData: any) => {
          //     const isDuplicate = this.educationArray.controls.some((control: AbstractControl) =>
          //       control.value.qualificationName?.trim().toLowerCase() === educationData.qualificationName?.trim().toLowerCase()
          //     );

          //     if (!isDuplicate) {
          //       this.educationArray.push(this.createEducationFormGroup(educationData));
          //     }
          //   });
          // }


          // const educationArray = this.educationArray;
          // educationArray.clear(); // clear existing form entries

          // Add existing education entries (disabled)
          // if (res?.candidateEducationDetails?.length) {
          //   res.candidateEducationDetails.forEach((educationData: any) => {
          //     const isDuplicate = educationArray.controls.some((control: AbstractControl) =>
          //       control.value.qualificationId === educationData.qualificationId
          //     );

          //     if (!isDuplicate) {
          //       educationArray.push(this.createEducationFormGroup(educationData)); // disabled row
          //     }
          //   });
          // }

          // educationArray.push(this.createEducationFormGroup());





        } else {
          this.resumeFile = null;
          this.photoFile = null;
          this.tenthFile = null;
          this.twelthFile = null;
          this.panFile = null;
          this.aadharFile = null;
          this.deplomaFile = null;
          this.degreeOrBTechFile = null;
          this.othersFile = null;
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        // console.log('HTTP Error:', err);
        this.isLoading = false
      }
    });
  }

  deleteFile(fileId: any): void {
    if (!this.empId) {
      console.error("Missing parameters: Employee ID or File ID is undefined.");
      return;
    }

    Swal.fire({
      html: `
      <div class="mb-3">
         <img src="https://cdn.dribbble.com/userupload/24380574/file/original-2070b7f112d8cdc5b374a8b7d80f1fc7.gif" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
      </div>
      <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to delete this file?</h5>
      <p class="text-muted mb-0" style="font-size: 14px;">
        Deleting this may affect your application records.
      </p>
    `,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        actions: 'd-flex justify-content-center gap-2',
        confirmButton: 'btn btn-danger btn-sm shadow-none',
        cancelButton: 'btn btn-sm btn-outline-secondary mr-2',
      },
      buttonsStyling: false,
      width: '500px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        const candidateId = this.empId;

        this.authService.deleteFile(candidateId, fileId).subscribe({
          next: (res: HttpResponse<any>) => {
            this.loadUserData();
            if (res.status === 200) {
              this.showAlert('Successfully Deleted', 'success');
            } else {
              this.showAlert("Delete Failed", 'danger');
            }
          },
          error: (err: HttpErrorResponse) => {
            // console.log("error : ", err);
            this.showAlert("Something went wrong", 'danger');
          }
        });
      }
    });
  }


  deleteExperience(experienceId: number, index: number) {
    Swal.fire({
      html: `
    <div class="mb-3">
      <img src="https://cdn.dribbble.com/userupload/24380574/file/original-2070b7f112d8cdc5b374a8b7d80f1fc7.gif" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
    </div>
    <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to remove this Experience?</h5>
    <p class="text-muted mb-0" style="font-size: 14px;">
      Deleting this may affect your application records.
    </p>
  `,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        actions: 'd-flex justify-content-center',
        confirmButton: 'btn btn-danger btn-sm shadow-none',
        cancelButton: 'btn btn-outline-secondary btn-sm shadow-none mr-2'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteExperience(experienceId).subscribe({
          next: () => {
            // Swal.fire({
            //   title: 'Deleted!',
            //   text: 'Successfully Deleted',
            //   icon: 'success',
            //   confirmButtonText: 'OK'
            // });
            this.showAlert("Successfully Deleted", "success")
            this.experienceArray.splice(index, 1);
            if (this.experienceArray.length === 0) {
              this.registrationForm.patchValue({
                companyName: '',
                totalExperience: '',
                LastOrStill_Working_Date: '',
                // currentSalary: '',
                // expectedSalary: '',
                // suitableJobDescription: '',
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            // console.log('Error deleting experience:', err);
          }
        });
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
    // if (!file) {
    //   console.error("No file available for download.");
    //   return;
    // }

    // const byteCharacters = atob(file); 
    // const byteNumbers = new Array(byteCharacters?.length)
    //   .fill(0)
    //   .map((_, i) => byteCharacters.charCodeAt(i));
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: "application/pdf" }); 

    // const a = document.createElement("a");
    // a.href = URL.createObjectURL(blob);
    // a.download = "document.pdf";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  }

  closePDF() {
    this.showPDF = false; // Hide the modal
    this.fileURL = null; // Clear the URL
  }

  updateDocument(name: string) {
    if (name === 'tenth') {
      this.tenthFile = ''
    } else if (name === 'twelth') {
      this.twelthFile = ''
    } else if (name === 'aadharFile') {
      this.aadharFile = ''
    } else if (name === 'panFile') {
      this.panFile = ''
    } else if (name === 'deploma') {
      this.deplomaFile = ''
    } else if (name === 'degreeOrBTech') {
      this.degreeOrBTechFile = ''
    } else if (name === 'others') {
      this.othersFile = ''
    }
  }


  removeEducation(educationId: number | null | undefined): void {
    if (!educationId) {
      console.error("Invalid educationId:", educationId);
      Swal.fire({
        title: 'Error',
        text: 'Education ID is missing or invalid.',
        icon: 'error',
        showConfirmButton: true,
      });
      return;
    }

    Swal.fire({
      html: `
    <div class="mb-3">
      <img src="https://cdn.dribbble.com/userupload/24380574/file/original-2070b7f112d8cdc5b374a8b7d80f1fc7.gif" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
    </div>
    <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to delete this Record?</h5>
    <p class="text-muted mb-0" style="font-size: 14px;">
      Deleting this may affect your application records.
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
        cancelButton: 'btn btn-outline-secondary btn-sm shadow-none mr-2',
        confirmButton: 'btn btn-danger btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        // console.log("index: ", index);
        // console.log("educationId: ", educationId);

        this.authService.deleteEducation(educationId).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.showAlert("Education record has been deleted.", "success");
            this.loadUserData();
            // console.log(res);
            // Swal.fire({
            //   title: 'Deleted!',
            //   text: 'Education record has been deleted.',
            //   icon: 'success',
            //   showConfirmButton: false,
            //   timer: 1000,
            //   timerProgressBar: true,
            // });
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            // console.log("Error deleting education:", err);
          }
        });
      }
    });
  }

  onlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
      this.showAlert("Only numbers (0-9) are allowed.", 'danger')
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
        this.showAlert("You cannot enter more than 2 digits before the dot.", "danger")
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Invalid Input',
        //   text: 'You cannot enter more than 2 digits before the dot.',
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
      return;
    }

    // Allow only one dot (.)
    if (input === '.') {
      if (currentValue.includes('.')) {
        event.preventDefault();
        this.showAlert("Only one dot (.) is allowed.", "danger")
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Invalid Input',
        //   text: 'Only one dot (.) is allowed.',
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
      return;
    }

    // Show SweetAlert for other invalid inputs
    event.preventDefault();
    this.showAlert("Please enter only numbers (0-9) with a single dot (.) for decimal values.", "danger")
    // Swal.fire({
    //   icon: 'warning',
    //   title: 'Invalid Input',
    //   text: 'Please enter only numbers (0-9) with a single dot (.) for decimal values.',
    //   timer: 2000,
    //   showConfirmButton: false
    // });
  }


  checkDuplicateCompanyName() {
    const enteredCompanyName = this.registrationForm.get('companyName')?.value?.trim().toUpperCase();

    if (!enteredCompanyName) return; // Skip if input is empty

    const isDuplicate = this.experienceArray.some(exp => exp.companyName.toUpperCase() === enteredCompanyName);

    if (isDuplicate) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Entry',
        text: `Company "${enteredCompanyName}" is already added.`,
        timer: 2000,
        showConfirmButton: false
      });

      // Clear the input field
      this.registrationForm.get('companyName')?.setValue('');
    }

  }




  edit(value: string) {
    if (value === 'personal') {
      this.isAllDataPresent = false;
      this.personalUpdate = true;
      this.uploadResume = 'Upload Resume'
      this.uploadPhoto = 'Upload Photo'
    } else if (value == 'address') {
      this.isAllAddressDataPresent = false;
      this.addressUpadte = true;
    } else if (value == 'experience') {
      this.isExperienceBoolean = false;
      this.experienceUpdate = true;
    } else if (value == 'emergency') {
      this.isEmergencyDataPresent = false;
      this.emergencyUpdate = true;
    } else if (value == 'bank') {
      console.log("rajender");
      this.isBankDataPresent = false;
      this.bankUpdate = true;
      this.bankFile = 'editBankFile'
    } else if (value == 'medical') {
      this.isMedicalDataPresent = false;
      this.medicalUpdate = true;
      this.MedicalReportFile = 'editMedicalFile'
    } else if (value == 'professional') {
      this.isProfessionalDataPresent = false;
      this.professionalUpdate = true;
    } else if (value == 'hrms') {
      this.isHrmsDataPresent = false;
      this.hrmsUpdate = true;
    }
  }

  onCommunicationAddressChange(value: string) {
    if (value === 'yes') {
      this.permanentCities = this.communicationCities
      const addressA = this.registrationForm.get('addressA')?.value;
      const addressB = this.registrationForm.get('addressB')?.value;
      const addressC = this.registrationForm.get('addressC')?.value;
      const stateId = this.registrationForm.get('stateId')?.value;
      const cityId = this.registrationForm.get('cityId')?.value;
      const postalCode = this.registrationForm.get('postalCode')?.value;

      this.registrationForm.patchValue({
        permanentAddressA: addressA,
        permanentAddressB: addressB,
        permanentAddressC: addressC,
        permanentStateId: stateId,
        permanentCityId: cityId,
        permanentPostalCode: postalCode
      });


      // Ensure the communication address is hidden when "yes" is selected
      setTimeout(() => {
        this.showCommunicationAddress = false;
      }, 0); // This triggers change detection

    } else if (value === 'no') {
      this.registrationForm.patchValue({
        permanentAddressA: '',
        permanentAddressB: '',
        permanentAddressC: '',
        permanentStateId: '',
        permanentCityId: '',
        permanentPostalCode: ''
      });

      // Ensure the communication address is shown when "no" is selected
      setTimeout(() => {
        this.showCommunicationAddress = true;
      }, 0); // This triggers change detection
    }
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

  // onFileSelect({ event, fieldName }: { event: Event; fieldName: string; }): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   const file = fileInput.files?.[0];

  //   if (file) {
  //     const maxSizeInMB = 5;
  //     const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  //     if (file.size > maxSizeInBytes) {
  //       Swal.fire({
  //         title: 'File Too Large',
  //         text: 'File size must be less than 5 MB.',
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       fileInput.value = '';
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

  //     if (fieldName == 'resume') {
  //       this.uploadResume = file.name
  //     }
  //     if (fieldName == 'photo') {
  //       this.uploadPhoto = file.name
  //     }

  //     // Store a clean copy of the file
  //     const selectedFile = new File([file], file.name, {
  //       type: file.type,
  //       lastModified: Date.now()
  //     });

  //     // console.log(`Selected file for ${fieldName}:`, selectedFile);
  //     this.selectedFiles[fieldName] = selectedFile;
  //   } else {
  //     // console.log(`No file selected for ${fieldName}`);
  //     return;
  //   }

  //   const formData = new FormData();
  //   let hasFile = false;

  //   // Append common fields
  //   formData.append('jobCodeId', this.jobCodeData?.jobCodeId);
  //   formData.append('moduleId', '4');
  //   formData.append('document', JSON.stringify({
  //     candidateId: this.jobCodeData?.candidateId
  //   }));

  //   // Map of fieldName => FormData key
  //   const fileFieldMap: { [key: string]: string } = {
  //     'tenth': 'tenthFile',
  //     'aadharFile': 'aadharFile',
  //     'panFile': 'panFile',
  //     'twelth': 'interFile',
  //     'deploma': 'pgFile',
  //     'degreeOrBTech': 'degreeFile',
  //     'others': 'otherFile'
  //   };

  //   // Append only the selected files
  //   for (const [key, formField] of Object.entries(fileFieldMap)) {
  //     const selected = this.selectedFiles[key];
  //     if (selected) {
  //       formData.append(formField, selected);
  //       hasFile = true;
  //     }
  //   }

  //   if (hasFile) {
  //     this.finalSave('documents', formData);
  //   }
  // }

  onFileSelect(event: Event, fieldName: string): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      // File size validation
      if (file.size > maxSizeInBytes) {
        Swal.fire({
          title: 'File Too Large',
          text: 'File size must be less than 5 MB.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        fileInput.value = '';
        return;
      }

      // File type validation
      if (file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type!',
          text: 'Please upload a PDF file only.',
        });
        fileInput.value = '';
        return;
      }
      if (fieldName === 'bankFile') {
        this.bankFileError = '';
      }
      if (fieldName === 'familyAadhar') {
        this.familyAadharFileError = '';
      }
      if (fieldName === 'medicalFile') {
        this.medicalFileError = '';
      }

      // Track uploaded file names
      const shortName = file.name.length > 25 ? file.name.substring(0, 25) + '...' : file.name;

      if (fieldName === 'resume') this.uploadResume = shortName;
      if (fieldName === 'photo') this.uploadPhoto = shortName;
      if (fieldName === 'bankFile') this.uploadBankFile = shortName;
      if (fieldName === 'familyAadhar') this.uploadFamilyAadharFile = shortName;
      if (fieldName === 'familyPhotoFile') this.uploadFamilyPhotoFile = shortName;
      if (fieldName === 'medicalFile') this.uploadMedicalFile = shortName;


      // Store clean file copy
      const selectedFile = new File([file], file.name, {
        type: file.type,
        lastModified: Date.now()
      });

      this.selectedFiles[fieldName] = selectedFile;
    } else {
      return;
    }

    const formData = new FormData();
    let hasFile = false;

    // Append common fields
    // formData.append('jobCodeId', this.empId);
    // formData.append('moduleId', '4');
    formData.append('moduleId', fieldName === 'agreementFile' ? '9' : '4');
    // formData.append('document', JSON.stringify({
    //   candidateId: this.empId
    // }));

    if (fieldName === 'agreementFile') {
      formData.append('agreementDetails', JSON.stringify({
        candidateId: this.empId
      }));
    } else {
      formData.append('document', JSON.stringify({
        candidateId: this.empId
      }));
    }


    // File mapping
    const fileFieldMap: { [key: string]: string } = {
      'tenth': 'tenthFile',
      'aadharFile': 'aadharFile',
      'panFile': 'panFile',
      'twelth': 'interFile',
      'deploma': 'pgFile',
      'degreeOrBTech': 'degreeFile',
      'others': 'otherFile',
      'agreementFile': 'agreementFile'
    };

    hasFile = false;
    let hasAgreement = false;

    // Append only selected files
    for (const [key, formField] of Object.entries(fileFieldMap)) {
      const selected = this.selectedFiles[key];
      if (selected) {
        formData.append(formField, selected);
        hasFile = true;
        if (key === 'agreementFile') {
          hasAgreement = true;
        }
      }
    }
    if (hasFile) {
      if (hasAgreement) {
        this.finalSave('professional', formData);
      } else {
        this.finalSave('documents', formData);
      }
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
        'email', 'mobileNumber', 'dob', 'titleId',
        'firstName', 'middleName', 'lastName', 'maritalStatusId', 'bloodGroupId', 'uan', 'passport',
        'genderId', 'fatherName', 'district', 'licence', 'pan', 'adhar', 'whatsappNumber',
        'alternateMobileNumber', 'nationality', 'nationality', 'religion', 'motherTongue', 'knownLanguages'
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

      const control = this.registrationForm.get('licence');
      const value = (control?.value || '').toString().trim().toUpperCase();
      console.log("DL Number:", value);

      if (value) {
        const pattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{6,12}$/;
        if (value.length < 10 || value.length > 16 || !pattern.test(value)) {
          control?.setErrors({ invalidLicence: true });
          control?.markAsTouched();
          isValid = false;
        } else {
          sectionData['licence'] = value;
        }
      }

      const uanControl = this.registrationForm.get('uan');
      const uanValue = (uanControl?.value || '').toString().trim();
      console.log("UAN:", uanValue);

      if (uanValue) {
        const pattern = /^[0-9]{12}$/;

        if (uanValue.length !== 12 || !pattern.test(uanValue)) {
          uanControl?.setErrors({ invalidUan: true });
          uanControl?.markAsTouched();
          isValid = false;
        } else {
          sectionData['uan'] = uanValue;
        }
      }

      const passportControl = this.registrationForm.get('passport');
      const passportValue = (passportControl?.value || '').toString().trim().toUpperCase();
      console.log("Passport:", passportValue);

      if (passportValue) {
        const pattern = /^[A-PR-WY][0-9]{7}$/;

        if (passportValue.length !== 8 || !pattern.test(passportValue)) {
          passportControl?.setErrors({ invalidPassport: true });
          passportControl?.markAsTouched();
          isValid = false;
        } else {
          sectionData['passport'] = passportValue;
        }
      }

      if (!isValid) {
        this.showAlert("Please fill required fields!", 'danger');
        // console.log("Form incomplete: ", sectionData);
        return;
      }

      // ✅ Format DOB (from dd-mm-yyyy or dd-MMM-yyyy to yyyy-mm-dd)
      if (sectionData.dob) {
        const formattedDob = this.convertToStandardDateFormat(sectionData.dob);
        if (formattedDob) {
          sectionData.dob = formattedDob;
        } else {
          console.error('Invalid DOB format:', sectionData.dob);
        }
      }

      if (this.empId) {
        sectionData.candidateId = this.empId;
      }

      let formData = new FormData();
      // sectionData.candidateId = this.jobCodeData?.candidateId;
      // formData.append('jobCodeId', this.jobCodeData?.candidatePersonalInformationDetails?.jobcodeId);
      // formData.append('candidateId', this.empId);
      formData.append('personalInfo', JSON.stringify(sectionData));
      // formData.append('personalImageFile', this.selectedFiles['photo']);
      // formData.append('personalResumeFile', this.selectedFiles['resume']);
      formData.append('moduleId', '1');
      // if (!this.selectedFiles['resume']) {
      //   this.showAlert("Resume file is required", "danger");
      //   formData.append('personalResumeFile', null);
      // }

      this.finalSave('address', formData);
    }
    else if (Action === 'address') {
      const communicationAddressFields = [
        'addressA', 'addressB', 'addressC',
        'stateId', 'cityId', 'postalCode', 'addressFlag'
      ];
      const permanentAddressFields = [
        'permanentAddressA', 'permanentAddressB', 'permanentAddressC',
        'permanentStateId', 'permanentPostalCode', 'permanentCityId'
      ];

      let isValid = true;
      let communicationAddress: any = {};
      let permanentAddress: any = {};

      // Collect communication address data
      communicationAddressFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          communicationAddress[field] = control?.value;
        }
      });

      // Collect permanent address data (keeping "permanent" prefix)
      permanentAddressFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          permanentAddress[field] = control?.value;
        }
      });

      if (!isValid) {
        // alert('Please fill in all required fields in the Address section.');
        // this.formFillMessageAlert();
        this.showAlert("Please fill required fields!", 'danger');
        return;
      }

      // Set up candidate ID and address flags
      communicationAddress.candidateId = this.empId;

      permanentAddress.candidateId = this.empId;

      let formData = new FormData();

      // Append both addresses as separate JSON objects
      formData.append("communicationAddress", JSON.stringify(communicationAddress));
      formData.append("permanentAddress", JSON.stringify(permanentAddress));
      formData.append('moduleId', '2');

      this.finalSave('education', formData);
    }
    else if (Action === 'education') {
      const educationFields = [
        'educationTypeId',
        'educationLevelId',
        'qualification',
        'universityId',
        'branch',
        'yearOfPassing',
        'percentage',
        'college'
      ];

      let educationSection: any = {};
      let isValid = true;

      educationFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          educationSection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill required fields!", 'danger');
        return;
      }

      educationSection.educationId = this.registrationForm.get('educationId')?.value || 1;
      educationSection.candidateId = this.empId;

      const formData = new FormData();
      formData.append("education", JSON.stringify([educationSection]));
      formData.append("moduleId", "3");

      this.finalSave('education', formData);
    }
    else if (Action === 'documents') {
      const documentsFields = ['tenth', 'twelth', 'panFile', 'aadharFile', 'deploma', 'degreeOrBTech', 'others'];
      let hasFile = false; // Flag to check if any file is present

      documentsFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        // alert('Please fill in all required fields in the Documents section.');
        this.formFillMessageAlert();
        return;
      }

      this.personalInfoArray.push({ documentDetails: { ...sectionData } });

      let formData = new FormData();
      // console.log("file array: ", this.selectedFiles);
      formData.append('jobCodeId', this.jobCodeData?.jobCodeId);

      const documentData = {
        candidateId: this.jobCodeData.candidateId
      };
      formData.append('document', JSON.stringify(documentData));
      formData.append('moduleId', '4');

      // Check if at least one file is present
      if (this.selectedFiles['tenth']) {
        formData.append('tenthFile', this.selectedFiles['tenth']);
        hasFile = true;
      }
      if (this.selectedFiles['twelth']) {
        formData.append('interFile', this.selectedFiles['twelth']);
        hasFile = true;
      }
      if (this.selectedFiles['aadharFile']) {
        formData.append('aadharFile', this.selectedFiles['aadharFile']);
        hasFile = true;
      }
      if (this.selectedFiles['panFile']) {
        formData.append('panFile', this.selectedFiles['panFile']);
        hasFile = true;
      }
      if (this.selectedFiles['deploma']) {
        formData.append('pgFile', this.selectedFiles['deploma']);
        hasFile = true;
      }
      if (this.selectedFiles['degreeOrBTech']) {
        formData.append('degreeFile', this.selectedFiles['degreeOrBTech']);
        hasFile = true;
      }
      if (this.selectedFiles['others']) {
        formData.append('otherFile', this.selectedFiles['others']);
        hasFile = true;
      }

      // Only call finalSave if at least one file is selected
      if (hasFile) {
        this.finalSave('documents', formData);
      } else {
        Swal.fire({
          title: 'warning',
          text: 'Please upload File',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      }
    }
    else if (Action === 'experienceWithCtc') {
      let isValid = true;
      const sectionData: any = {};

      const experienceFields = this.isFresher
        ? ['joiningTime', 'isFresher']
        : [
          'joiningTime', 'isFresher', 'currentSalary', 'expectedSalary', 'suitableJobDescription',
          // 'LastOrStill_Working_Date','totalExperience','companyName',
          // 'payslipFile', 'serviceLetterFile'
        ];

      experienceFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control?.value;
        }
      });

      if (!isValid) {
        // alert('Please fill in all required fields in the Experience section.');
        // this.formFillMessageAlert();
        this.showAlert("Please fill required fields!", "danger")
        return;
      }

      const experienceData: any = {
        candidateId: this.empId,
        isFresher: sectionData.isFresher === 'fresher',
        joiningId: sectionData.joiningTime
      };

      if (!this.isFresher) {
        // experienceData.experienceMapDTO = [
        //   {
        //     companyName: sectionData.companyName,
        //     totalExp: sectionData.totalExperience,
        //     lastWorkingDate: this.datePipe.transform(sectionData.LastOrStill_Working_Date, 'dd-MM-yyyy')
        //   }
        // ];

        // experienceData.experienceSalaryDTO = {
        //   currentSalary: sectionData.currentSalary,
        //   expectedSalary: sectionData.expectedSalary,
        //   description: sectionData.suitableJobDescription
        // };
        experienceData.currentSalary = sectionData.currentSalary;
        experienceData.expectedSalary = sectionData.expectedSalary;
        experienceData.description = sectionData.suitableJobDescription;

      }

      this.personalInfoArray.push({ experience: { ...experienceData } });

      let formData = new FormData();
      formData.append("experience", JSON.stringify(experienceData));
      formData.append('jobCodeId', this.jobCodeData?.jobCodeId);
      formData.append('candidateId', this.jobCodeData.candidateId);
      formData.append('moduleId', '5');
      if (this.payslipFile) {
        formData.append('paySlips', this.payslipFile);
      }
      // else {
      //   formData.append('paySlips', null);
      // }
      if (this.serviceLetterFile) {
        formData.append('expService', this.serviceLetterFile);
      }
      //  else {
      //   formData.append('expService', null);
      // }

      this.finalSave('experience', formData);
    }
    else if (Action === 'experienceWithCompany') {
      console.log("rajender");
      if (!this.experienceId) {
        this.showAlert("Experience ID is not available!", "danger");
        return;
      }
      let isValid = true;
      const sectionData: any = {};
      const experienceFields = ['LastOrStill_Working_Date', 'totalExperience', 'companyName'];
      experienceFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          sectionData[field] = control.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill required fields!", "danger");
        return;
      }
      const experienceData: any = {
        companyName: sectionData.companyName,
        totalExp: sectionData.totalExperience,
        lastWorkingDate: this.datePipe.transform(sectionData.LastOrStill_Working_Date, 'yyyy-MM-dd'),
        experienceId: this.experienceId
      };
      const experiencePayload = {
        experienceId: experienceData.experienceId,
        companyName: experienceData.companyName,
        totalExp: experienceData.totalExp,
        lastWorkingDate: experienceData.lastWorkingDate,
        // jobCodeId: this.jobCodeData?.jobCodeId,
        // candidateId: this.jobCodeData?.candidateId,
        moduleId: '5'
      };
      this.authService.ExperienceAdd(experiencePayload).subscribe({
        next: (res: any) => {
          this.showAlert("Experience added Successfully.", 'success');
          this.loadUserData();
          this.registrationForm.get('LastOrStill_Working_Date')?.reset();
          this.registrationForm.get('totalExperience')?.reset();
          this.registrationForm.get('companyName')?.reset();
        },
        error: (err: HttpErrorResponse) => {
          console.log("error : ", err);
        }
      })

    }
    else if (Action === 'emergency') {
      const emergencyFields = [
        'relationId',
        'emergencyFirstname',
        'emergencyLastname',
        'emergencyContact',
        'emergencyEmail',
        'completeaAddress'
      ];

      let emergencySection: any = {};
      let isValid = true;

      emergencyFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          emergencySection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill all required fields!", 'danger');
        return;
      }

      // Build final JSON according to your required structure
      const finalEmergencyData = {
        relationId: emergencySection.relationId,
        firstName: emergencySection.emergencyFirstname,
        lastName: emergencySection.emergencyLastname,
        contactNumber: emergencySection.emergencyContact,
        email: emergencySection.emergencyEmail,
        address: emergencySection.completeaAddress,
        candidateId: this.empId
      };

      console.log('Final Emergency JSON:', finalEmergencyData);
      const formData = new FormData();
      formData.append('emergencyDetails', JSON.stringify(finalEmergencyData));
      formData.append('moduleId', '6');
      this.finalSave('bank', formData);
    } else if (Action === 'bank') {
      const bankFields = [
        'accountNumber',
        'confirmAccountNumber',
        'bankName',
        'ifscCode',
        'identificationMarkA',
        'identificationMarkB'
      ];

      let bankSection: any = {};
      let isValid = true;

      // Validate fields
      bankFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          bankSection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill all required fields!", 'danger');
        return;
      }

      // Account Number match validation
      const accNum = bankSection.accountNumber;
      const conAccNum = bankSection.confirmAccountNumber;

      if (accNum !== conAccNum) {
        Swal.fire({
          icon: 'warning',
          title: 'Account Number Mismatch',
          text: 'Account Number and Confirm Account Number must be the same.',
          confirmButtonText: 'OK',
        });
        return;
      }

      // Build final JSON
      const finalBankData = {
        accountNumber: bankSection.accountNumber,
        confirmAccountNumber: bankSection.confirmAccountNumber,
        bankId: bankSection.bankName,
        ifscCode: bankSection.ifscCode,
        identificationMarkA: bankSection.identificationMarkA,
        identificationMarkB: bankSection.identificationMarkB,
        candidateId: this.empId
      };

      console.log('Final Bank JSON:', finalBankData);

      // Prepare FormData
      const formData = new FormData();
      formData.append('bankDetails', JSON.stringify(finalBankData));
      formData.append('moduleId', '7');

      // ✅ Append bank file if available
      if (this.selectedFiles['bankFile']) {
        formData.append('bankFile', this.selectedFiles['bankFile']);
        this.bankFileError = ''
      } else {
        if (this.bankFile == 'editBankFile') {
          this.bankFileError = ''
        } else {
          this.bankFileError = 'Please choose a bank passbook PDF file.';
          return;
        }
      }

      this.finalSave('family', formData);
    }
    else if (Action === 'family') {
      const familyFields = [
        'familyRelationId',
        'familyFirstName',
        'familyLastName',
        'familyDOB',
        'familyContact',
        'familyGender',
        'familyBloodGroup',
        'familyIsdependent',
        'familyIsExpired',
        'familyIsPFNominee',
        'familyIsGraduityNominee',
        'familyOccupation',
        'familyAge',
        'familyStatus'
      ];

      let familySection: any = {};
      let isValid = true;

      // ✅ Validate form fields
      familyFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          familySection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill all required fields!", 'danger');
        return;
      }

      // ✅ Build final JSON object
      const finalFamilyData = {
        candidateId: this.empId,
        relationId: familySection.familyRelationId,
        firstName: familySection.familyFirstName,
        lastName: familySection.familyLastName,
        // dob: familySection.familyDOB,
        dob: familySection.familyDOB ? new Date(familySection.familyDOB).toISOString().split('T')[0] : '',
        contactNumber: familySection.familyContact,
        gender: familySection.familyGender,
        bloodGroup: familySection.familyBloodGroup,
        isDependent: familySection.familyIsdependent,
        isExpired: familySection.familyIsExpired,
        isPfNominee: familySection.familyIsPFNominee,
        isGraduityNominee: familySection.familyIsGraduityNominee,
        occupation: familySection.familyOccupation,
        age: familySection.familyAge,
        familyStatus: familySection.familyStatus
      };

      console.log('Final Family JSON:', finalFamilyData);

      const formData = new FormData();
      formData.append('familyDetails', JSON.stringify(finalFamilyData));
      formData.append('moduleId', '8');

      if (this.selectedFiles['familyAadhar']) {
        formData.append('familyAadharFile', this.selectedFiles['familyAadhar']);
        this.familyAadharFileError = '';
      } else {
        this.familyAadharFileError = 'Please choose the Aadhaar PDF file.';
        return;
      }

      if (this.selectedFiles['familyPhotoFile']) {
        formData.append('familyPhotoFile', this.selectedFiles['familyPhotoFile']);
      }

      this.finalSave('family', formData);
    }
    else if (Action === 'professional') {
      console.log("rajender")
      const professionalFields = [
        'department',
        'designation',
        'workLocation',
        // 'ishod',
        'reportingManager',
        // 'paysheetGroup',
        'incrementType',
        'businessUnit',
        'hodName'
      ];

      let professionalSection: any = {};
      let isValid = true;

      professionalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          professionalSection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill all required professional information fields!", 'danger');
        return;
      }

      console.log("rajender1")

      const finalProfessionalData = {
        candidateId: this.empId,
        departmentId: professionalSection.department,
        designationId: professionalSection.designation,
        workLocationId: professionalSection.workLocation,
        // isHOD: professionalSection.ishod,
        reportingManagerId: professionalSection.reportingManager,
        // paysheetGroup: professionalSection.paysheetGroup,
        incrementTypeId: professionalSection.incrementType,
        buId: professionalSection.businessUnit,
        reportingHeadId: professionalSection.hodName,
      };

      console.log('Final Professional JSON:', finalProfessionalData);

      const formData = new FormData();
      formData.append('professionalDetails', JSON.stringify(finalProfessionalData));
      formData.append('moduleId', '11');
      this.finalSave('professional', formData);
    }
    else if (Action === 'medical') {
      const medicalFields = ['medicalDescription'];
      let medicalSection: any = {};
      let isValid = true;

      medicalFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          medicalSection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill all required fields!", 'danger');
        return;
      }

      // ✅ Build final JSON for medical report
      const finalMedicalData = {
        description: medicalSection.medicalDescription,
        candidateId: this.empId
      };

      console.log('Final Medical JSON:', finalMedicalData);

      // ✅ Prepare FormData
      const formData = new FormData();
      formData.append('medicalDetails', JSON.stringify(finalMedicalData));
      formData.append('moduleId', '10');

      // ✅ Append medical file if available
      if (this.selectedFiles['medicalFile']) {
        formData.append('medicalFile', this.selectedFiles['medicalFile']);
        this.medicalFileError = '';
      } else {
        this.medicalFileError = 'Please upload the Medical Report';
        this.showAlert(this.medicalFileError, 'danger');
        return;
      }

      // ✅ Final save call
      this.finalSave('medical', formData);
    }
    else if (Action === 'hrms') {
      const hrmsFields = [
        'noticePeriod',
        'probationPeriod',
        'employeeType',
        'division',
        'ptState',
        'costCenter',
        'costDigit',
        'saleState',
        'saleHQ',
        'saleGroup',
        'CTC',
        'dateAsPerLetter',
        'FirstDay'
      ];

      let hrmsSection: any = {};
      let isValid = true;

      hrmsFields.forEach((field) => {
        const control = this.registrationForm.get(field);
        if (control?.invalid) {
          control.markAsTouched();
          isValid = false;
        } else {
          hrmsSection[field] = control?.value;
        }
      });

      if (!isValid) {
        this.showAlert("Please fill all required HRMS information fields!", 'danger');
        return;
      }

      console.log("rajender - HRMS validation passed");

      const finalHRMSData = {
        candidateId: this.empId,
        noticePeriodId: hrmsSection.noticePeriod,
        probationId: hrmsSection.probationPeriod,
        employeeType: hrmsSection.employeeType,
        division: hrmsSection.division,
        ptState: hrmsSection.ptState,
        costCenterId: hrmsSection.costCenter,
        digit: hrmsSection.costDigit,
        saleDistrict: hrmsSection.saleState,
        saleHq: hrmsSection.saleHQ,
        saleGroup: hrmsSection.saleGroup,
        finalCtc: hrmsSection.CTC,
        offerLetterDate: this.datePipe.transform(this.toDate(hrmsSection.dateAsPerLetter), 'yyyy-MM-dd'),
        joiningDate: this.datePipe.transform(this.toDate(hrmsSection.FirstDay), 'yyyy-MM-dd'),
        loginId: this.loginId
      };

      console.log('Final HRMS JSON:', finalHRMSData);

      // return;

      const formData = new FormData();
      formData.append('hrmsDetails', JSON.stringify(finalHRMSData));
      this.FinalMoveToHrms('hrms', finalHRMSData);
    }

  }

  finalSave(action: string, formData) {
    formData.append('jobCodeId', this.jobCodeData?.candidatePersonalInformationDetails?.jobcodeId);
    formData.append('candidateId', this.empId);
    // console.log("education jobcode id : ", this.jobCodeData?.jobCodeId, "candidate id: ", this.jobCodeData?.candidateId)
    this.isLoading = true;
    // console.log(" form data : ", formData)
    // return false
    this.authService.hiringRegister(formData).subscribe({
      next: (res: HttpResponse<any>) => {
        this.isLoading = false;
        // console.log("personal result : ", res);

        if (res.status === 200) {
          this.isLoading = false;
          this.loadUserData();
          // const educationArray = this.registrationForm.get('educationDetails') as FormArray;
          // if (educationArray) {
          //   educationArray.clear();
          //   educationArray.push(this.createEducationFormGroup());
          // }
          this.selectedFiles = {}
          this.personalUpdate = false;
          this.addressUpadte = false;
          this.emergencyUpdate = false;
          this.bankUpdate = false;
          this.medicalUpdate = false;
          this.professionalUpdate = false;
          this.hrmsUpdate = false;
          // Swal.fire({
          //   title: 'Success',
          //   text: 'Successfully completed',
          //   icon: 'success',
          //   showConfirmButton: true,
          // });

          this.showAlert("Successfully completed", "success");
          this.setActiveSection(action);
          if (action === 'education') {
            const educationFields = [
              'educationTypeId',
              'educationLevelId',
              'qualification',
              'universityId',
              'branch',
              'yearOfPassing',
              'percentage',
              'college'
            ];

            educationFields.forEach(field => {
              this.registrationForm.get(field)?.setValue('');
              this.registrationForm.get(field)?.markAsPristine();
              this.registrationForm.get(field)?.markAsUntouched();
            });
          } else if (action === 'documents') {
            this.selectedFiles = {}
            const educationArray = this.registrationForm.get('educationDetails') as FormArray;
            if (educationArray) {
              educationArray.clear();
              // educationArray.push(this.createEducationFormGroup());
            }
            this.updateDocumentFlag = false;
            // this.fileInput.nativeElement.value = '';
          } else if (action === 'experience') {
            // this.loadUserData();
            const educationArray = this.registrationForm.get('educationDetails') as FormArray;
            // this.selectedFiles = {}
            // this.payslipFile = null;
            // this.serviceLetterFile = null;
            if (educationArray) {
              educationArray.clear();
              // educationArray.push(this.createEducationFormGroup());
            }
            this.registrationForm.patchValue({
              companyName: '',
              totalExperience: '',
              LastOrStill_Working_Date: '',
              // currentSalary: '',
              // expectedSalary: '',
              // suitableJobDescription: '',
            });
          } else if (action === 'family') {
            const educationFields = [
              'familyRelationId',
              'familyFirstName',
              'familyLastName',
              'familyDOB',
              'familyContact',
              'familyGender',
              'familyBloodGroup',
              'familyIsdependent',
              'familyIsExpired',
              'familyIsPFNominee',
              'familyIsGraduityNominee',
              'familyOccupation',
              'familyAge',
              'familyStatus'
            ];
            this.uploadFamilyAadharFile = 'Upload Aadhar';
            this.uploadFamilyPhotoFile = 'Upload Family Photo';

            educationFields.forEach(field => {
              this.registrationForm.get(field)?.setValue('');
              this.registrationForm.get(field)?.markAsPristine();
              this.registrationForm.get(field)?.markAsUntouched();
            });
          }
        } else if (res.status === 500) {
          const errorMessage = (res as any).message || 'Failed';
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }

      }, error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.selectedFiles = {};
        // console.log("error : ", err);
        Swal.fire({
          title: 'error',
          text: err.error.message = 'failed',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    })
  }

  title() {
    this.authService.title().subscribe({
      next: (res: any) => {
        this.titleOptions = res;
      },
      error: (err: HttpErrorResponse) => {
      }
    })
  }
  gender() {
    this.authService.gender().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res);
        this.genderOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }
  marriageStatus() {
    this.authService.marriageStatus().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.marriatalStatusOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }
  university() {
    this.authService.university().subscribe({
      next: (res: any) => {
        // console.log("univercities : ", res)
        this.universityOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err);
      }
    })
  }

  educationLevel() {
    this.authService.educationLevel().subscribe({
      next: (res: any) => {
        // console.log("univercities : ", res)
        this.educationLevelOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err);
      }
    })
  }

  onEducationLevelChange(selectedId: string): void {
    if (selectedId) {
      const educationLevelId = parseInt(selectedId, 10);
      console.log("Education level ID:", educationLevelId);
      this.qualificationOptions = [];
      this.branchOptions = [];
      this.registrationForm.get('qualification')?.setValue('');
      this.registrationForm.get('branch')?.setValue('');

      this.getQualificationsByEducationLevelId(educationLevelId);
    } else {
      this.qualificationOptions = [];
      this.branchOptions = [];
      this.registrationForm.get('qualification')?.setValue('');
      this.registrationForm.get('branch')?.setValue('');
    }
  }

  getQualificationsByEducationLevelId(educationLevelId: number): void {
    this.authService.qualification(educationLevelId).subscribe({
      next: (qualifications: any) => {
        this.qualificationOptions = qualifications;
      },
      error: (err) => {
        console.error('Error fetching qualifications', err);
      }
    });
  }

  onQualificationChange(event: Event): void {
    const selectedName = (event.target as HTMLSelectElement).value;
    console.log('Selected name:', selectedName);

    if (selectedName) {
      const formData = new FormData();
      formData.append('qualificationName', selectedName);

      this.branch(formData);
    }
  }

  branch(formData: FormData) {
    console.log(formData)
    this.authService.branch(formData).subscribe({
      next: (res: any) => {
        this.branchOptions = res;
      },
      error: (err) => {
        console.error('Branch API error:', err);
      }
    });
  }

  joiningTime() {
    this.authService.joiningTime().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.joiningOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }

  bloodGroup() {
    this.authService.bloodGroup().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.bloodGroupOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }

  languages() {
    this.authService.languages().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.languageOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }

  religion() {
      this.authService.religion().subscribe({
        next: (res: any) => {
          // console.log("titles : ",res)
          this.religionOptions = res;
        },
        error: (err: HttpErrorResponse) => {
          // console.log("error", err)
        }
      })
    }

  relation() {
    this.authService.relation().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.relationOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }

  banks() {
    this.authService.banks().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.bankOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }

  loadYesNoOptions() {
    this.authService.yesNoOptions().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.yesNoOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }

  status() {
    this.authService.status().subscribe({
      next: (res: any) => {
        // console.log("titles : ",res)
        this.statusOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error", err)
      }
    })
  }



  states() {
    this.authService.states().subscribe({
      next: (res: any) => {
        this.indianStates = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("Error fetching states:", err);
      }
    });
  }

  // Function to handle state change separately for communication & permanent
  onStateChange(event: Event, addressType: 'communication' | 'permanent') {
    const selectedStateId = (event.target as HTMLSelectElement).value;

    if (selectedStateId) {
      this.getCities(selectedStateId, addressType);
    }
  }

  getCities(
    stateId: string,
    addressType: 'communication' | 'permanent',
    backendCityId?: string
  ) {
    this.authService.cities(stateId).subscribe({
      next: (cities: any[]) => {
        if (!cities || cities.length === 0) {
          this.setCitiesAndPatch(null, addressType, null);
          return;
        }

        const isValidCity = cities.some(city => city.id === backendCityId);
        const finalCityId = isValidCity ? backendCityId : null;

        this.setCitiesAndPatch(cities, addressType, finalCityId);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching cities:', err);
        this.setCitiesAndPatch([], addressType, null);
      }
    });
  }



  masterBu() {
    this.authService.masterBu().subscribe({
      next: (res: any[]) => {
        this.businessUnitsListOptions = [...res];
      },
      error: (err) => {
        console.error('Error fetching business unit data:', err);
      },
    });
  }

  listOfManagers(): void {
    this.authService.ReportingManagers().subscribe({
      next: (res: any) => {
        this.managersListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  totalDepartments() {
    this.authService.totalDepartments().subscribe({
      next: (res: any) => {
        this.departmentListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  designation() {
    this.authService.getDesignations().subscribe({
      next: (res: any) => {
        this.designationListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  employeeList() {
    this.authService.employeeList().subscribe({
      next: (res) => {
        this.employeeDataListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  ptStates() {
    this.authService.ptStates().subscribe({
      next: (res) => {
        this.ptStatesListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  onBusinessUnitChange(event: any) {
    const selectedId = event.target.value;
    this.registrationForm.get('costCenter')?.setValue('');
    const selectedItem = this.businessUnitsListOptions.find(item => item.id == selectedId);
    console.log("selected item : ", selectedItem.id);
    this.costCenter(selectedItem.id)

  }

  // costCenter(id: any) {
  //   this.authService.costCenterList(id).subscribe({
  //     next: (res: any) => {
  //       this.costCenterList = res;
  //       const selectedId = this.jobCodeData?.fetchingEmployeeMoveToHrmsDTO?.costCenterId;
  //       console.log("cost center list : ", this.costCenterList)
  //       const selectedItem = this.costCenterList.find((item: any) => item.id == selectedId);
  //       console.log("Selected item :", selectedItem)
  //       if (selectedItem) {
  //         console.log('Selected Cost Center Name:', selectedItem.name);
  //         if (selectedItem.name?.toUpperCase() === 'OFFICE') {
  //           this.registrationForm.patchValue({ costDigit: 5 });
  //         }
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.log("Error fetching managers:", err);
  //     }
  //   });
  // }

  costCenter(id: any) {
    this.authService.costCenterList(id).subscribe({
      next: (res: any) => {
        this.costCenterList = res || [];

        if (this.jobCodeData?.fetchingEmployeeMoveToHrmsDTO?.costCenterId) {
          const selectedId = this.jobCodeData?.fetchingEmployeeMoveToHrmsDTO?.costCenterId;
          console.log("Selected ID:", selectedId);
          console.log("Cost Center List:", this.costCenterList);
          const selectedItem = this.costCenterList.find((item: any) => {
            return String(item.id) === String(selectedId) ||
              String(item.costCenterId) === String(selectedId);
          });

          console.log("Selected item:", selectedItem);

          if (selectedItem) {
            console.log('Selected Cost Center Name:', selectedItem.name);
            if (selectedItem.name?.trim().toUpperCase() === 'OFFICE') {
              this.registrationForm.patchValue({ costDigit: '5' });
              this.costCenterDisableVlaue = true;
            } else {
              this.registrationForm.patchValue({ costDigit: '' });
            }
          } else {
            console.warn("No cost center matched the selectedId");
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error fetching cost centers:", err);
      }
    });
  }


  salesDistrict() {
    this.authService.salesDistrict().subscribe({
      next: (res) => {
        this.salesDistrictListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  salesOffice() {
    this.authService.salesOffice().subscribe({
      next: (res: any) => {
        this.salesOfficeListOptions = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  onSalesOfficeChange(event: any) {
    const selectedId = event.target.value;
    //  console.log("selected sale office id : ",selectedId)
    this.salesGroup(selectedId);
    this.registrationForm.get('saleGroup')?.setValue('');
  }


  salesGroup(id: any) {
    this.authService.salesGroup(id).subscribe({
      next: (res) => {
        this.salesGroupListOptions = res;
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



  workLocation() {
    this.authService.workLocation().subscribe({
      next: (res: any) => {
        this.workLocationList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  hodName(reportingId: any) {
    this.authService.getHodName(reportingId).subscribe({
      next: (res: any) => {
        console.log("hod name with id : ", res);
        this.hodNameList = res;
        // this.registrationForm.get('hodName')?.patchValue(res[0].id);
        this.registrationForm.get('hodName')?.patchValue(res[0]?.id || '');
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  increamentType() {
    this.authService.increamentType().subscribe({
      next: (res: any) => {
        this.increamentTypeList = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error fetching managers:", err);
      }
    });
  }

  costCenterChange(event: any) {
    const selectedId = event.target.value;
    const selectedItem = this.costCenterList.find((item: any) => item.id == selectedId);
    if (selectedItem) {
      if (selectedItem.name.toUpperCase() === 'OFFICE') {
        this.registrationForm.patchValue({ costDigit: '5' });
        this.costCenterDisableVlaue = true;
      } else {
        this.registrationForm.patchValue({ costDigit: '' });
        this.costCenterDisableVlaue = false;
      }
    } else {
      console.log("No cost center found for ID:", selectedId);
    }
  }


  private setCitiesAndPatch(cities: any[] | null, addressType: 'communication' | 'permanent', cityId: string | null) {
    const patchedCityId = cityId ?? '';

    if (addressType === 'communication') {
      this.communicationCities = cities ?? [];
      setTimeout(() => {
        this.registrationForm.get('cityId')?.patchValue(patchedCityId);
      });
    } else {
      this.permanentCities = cities ?? [];
      setTimeout(() => {
        this.registrationForm.get('permanentCityId')?.patchValue(patchedCityId);
      });
    }
  }

  getProgressWidth(): string {
    const stepWidths = {
      personal: '20%',
      address: '40%',
      education: '60%',
      documents: '80%',
      experience: '100%'
    };
    return stepWidths[this.activeTab] || '0%';
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
      <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to Save & Exit?</h5>
      <p class="text-muted mb-0" style="font-size: 14px;">
        You will need to log in again to access your profile and application details.
      </p>
    `,
      showCancelButton: true,
      confirmButtonText: 'Exit',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        // actions: 'd-flex justify-content-center',
        confirmButton: 'btn btn-primary btn-sm w-100 mb-2 shadow-none',
        cancelButton: 'btn btn-sm btn-outline-secondary w-100',
      },
      buttonsStyling: false,
      width: '500px',
      backdrop: true
    }).then((result) => {

      if (result.isConfirmed) {
        this.router.navigate(['/employee-code'])
      }



    });
  }

  checkDuplicateQualification(index: number): boolean {
    const educationArray = this.registrationForm.get('educationDetails') as FormArray;
    const currentQual = educationArray.at(index).get('qualification')?.value;

    if (!currentQual) return false;

    // Count how many times this qualification appears in the form
    const duplicates = educationArray.controls.filter((control, i) => {
      return i !== index && control.get('qualification')?.value === currentQual;
    });

    return duplicates.length > 0;
  }

  panCardKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const value = input?.value;
    const pos = input.selectionStart ?? value?.length;

    if (
      ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key) ||
      (event.ctrlKey || event.metaKey)
    ) {
      return;
    }

    if (value?.length >= 10 && input.selectionStart === input.selectionEnd) {
      event.preventDefault();
      this.showInvalidPanAlert('PAN number cannot be more than 10 characters.');
      return;
    }

    if (pos < 5) {
      if (!/^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        this.showInvalidPanAlert('Only letters (A-Z) allowed in first 5 characters');
      }
    } else if (pos >= 5 && pos < 9) {
      if (!/^[0-9]$/.test(key)) {
        event.preventDefault();
        this.showInvalidPanAlert('Only digits (0-9) allowed in positions 6–9');
      }
    } else if (pos === 9) {
      if (!/^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        this.showInvalidPanAlert('Last character must be a letter (A-Z)');
      }
    } else {
      event.preventDefault();
    }
  }

  private showInvalidPanAlert(message: string): void {
    this.alertMessage = message;

    clearTimeout(this.panAlertTimeout);
    this.panAlertTimeout = setTimeout(() => {
      this.alertMessage = null;
    }, 2000); // alert visible for 2 seconds
  }

  openTenthFileInput(): void {
    this.hiddenTenthInput.nativeElement.click();
  }

  openAadharFileInput(): void {
    this.hiddenAadharInput.nativeElement.click();
  }

  openAgreementFileInput(): void {
    this.hiddenAgreementInput.nativeElement.click();
  }

  openPanFileInput(): void {
    this.hiddenPanInput.nativeElement.click();
  }

  openTwelthFileInput(): void {
    this.hiddenTwelthInput.nativeElement.click();
  }

  openDegreeOrBTechInput(): void {
    this.hiddenDegreeOrBTechInput.nativeElement.click();
  }
  openDeplomaInput(): void {
    this.hiddenDeplomaInput.nativeElement.click();
  }
  openOthersInput(): void {
    this.hiddenOthersInput.nativeElement.click();
  }

  // onFileChange(event: any, controlName: string) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.registrationForm.get(controlName)?.setValue(file);
  //     console.log("file : ", file);


  //     if (controlName === 'payslipFile') {
  //       this.payslipFile = file;
  //       this.selectedPayslip1FileName = file.name;
  //     } else if (controlName === 'serviceLetterFile') {
  //       this.serviceLetterFile = file;
  //       this.selectedServiceLetterFileName = file.name
  //     }
  //   }
  // }
  onFileChange(event: any, controlName: string, fileId: any) {
    const file = event.target.files[0];
    console.log("file id : ", fileId);
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'File size must be less than 5 MB.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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

    this.registrationForm.get(controlName)?.setValue(file);
    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append('jobCodeId', this.jobCodeData?.jobCodeId);
    formData.append('moduleId', '5');
    formData.append('experienceId', this.experienceId);
    formData.append('candidateId', this.jobCodeData?.candidateId);
    formData.append('fileNo', fileId);
    formData.append('file', file);

    this.isLoading = true;
    this.authService.experienceFileAdd(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.showAlert("File uploaded successfully.", 'success');
        this.loadUserData();
      },
      error: (err: HttpErrorResponse) => {
        console.error("Upload error:", err);
        this.isLoading = false;
      }
    });
  }



  deleteExpericeFile(id: any) {
    if (!this.experienceId) {
      this.showAlert("Experience ID is not available!", "danger");
      return;
    }

    Swal.fire({
      html: `
    <div class="mb-3">
      <img src="https://cdn.dribbble.com/userupload/24380574/file/original-2070b7f112d8cdc5b374a8b7d80f1fc7.gif" alt="delete" style="width:60px; height:60px; border-radius: 15px;" />
    </div>
    <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to delete this File?</h5>
    <p class="text-muted mb-0" style="font-size: 14px;">
      Deleting this may affect your application records.
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
        cancelButton: 'btn btn-outline-secondary btn-sm shadow-none mr-2',
        confirmButton: 'btn btn-danger btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("id : ", id);
        this.authService.ExperienceFileDelete(this.experienceId, id).subscribe({
          next: (res: any) => {
            this.showAlert("File Deleted successfully.", "success");
            this.loadUserData();
          },
          error: (err: HttpErrorResponse) => {
            this.showAlert("error while deleting file!", "danger")
          }
        })
      }
    })
  }



  checkIfLoginExpired(): void {
    const createdDateStr = this.jobCodeData?.createdDateTime;

    if (createdDateStr) {
      // Convert string to valid Date (replace space with T for ISO format)
      const createdDate = new Date(createdDateStr.replace(' ', 'T'));
      const now = new Date();

      // Calculate difference in milliseconds
      const diffInMs = now.getTime() - createdDate.getTime();

      // Convert to days
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      // console.log('Days since login:', diffInDays);

      // If more than 5 days have passed, redirect
      if (diffInDays > 5) {
        this.logout();
      }
    }
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


  UpdatePayslip() {
    this.paySlipFilePath1 = null;
    this.serviceFilePath = null;
  }

  // Place this function outside your component method for reuse
  convertToStandardDateFormat(inputDate: string): string | null {
    if (!inputDate || typeof inputDate !== 'string') return null;

    const monthMap: { [key: string]: string } = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    const parts = inputDate.split('-');
    if (parts.length !== 3) return null;

    const [day, monthRaw, year] = parts;
    const month = isNaN(Number(monthRaw))
      ? monthMap[monthRaw] // "Jun" → "06"
      : ('0' + monthRaw).slice(-2); // "6" → "06"

    if (!month) return null;

    return `${year}-${month}-${day}`;
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

  InterviewStatus() {
    Swal.fire({
      html: `
        <div class="mb-3">
          <img src="assets/img/job-code/document-gif.gif" alt="delete" style="width:60px; height:60px;" />
        </div>
        <h5 class="mb-2" style="font-weight: bold;">Interview Process Started!</h5>
        <p class="text-muted mb-0" style="font-size: 14px;">
        Your interview has started. Please stay updated and be available as per the schedule. Updates will follow via email.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Track Interview Status',
      cancelButtonText: 'Close',
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        confirmButton: 'btn btn-primary btn-sm shadow-none w-100 mb-2',
        cancelButton: 'btn btn-outline-secondary btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.setActiveSection('status');
      }
    });
  }

  completedStatus() {
    Swal.fire({
      html: `
    <div class="mb-3">
      <img src="assets/img/job-code/document-gif.gif" alt="delete" style="width:60px; height:60px;" />
    </div>
    <h5 class="mb-2" style="font-weight: bold;">Submission Successful!</h5>
    <p class="text-muted mb-0" style="font-size: 14px;">
      Your application has been submitted. All further updates will be shared with you via email.
    </p>
  `,
      showCancelButton: true,
      confirmButtonText: 'Track Interview Status',
      cancelButtonText: 'Close',
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        confirmButton: 'btn btn-primary btn-sm shadow-none w-100 mb-2',
        cancelButton: 'btn btn-outline-secondary btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.setActiveSection('status');
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

  allowOnlyLetters(event: KeyboardEvent) {
    const charCode = event.key;
    const pattern = /^[a-zA-Z\s]*$/;

    if (!pattern.test(charCode)) {
      event.preventDefault();
    }
  }

  // dlKeydown(event: KeyboardEvent): void {
  //   const input = event.target as HTMLInputElement;
  //   const key = event.key.toUpperCase();
  //   const value = input?.value.toUpperCase();
  //   const pos = input.selectionStart ?? value.length;

  //   // Allow control/navigation keys
  //   if (
  //     ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key) ||
  //     event.ctrlKey || event.metaKey
  //   ) {
  //     return;
  //   }

  //   // Maximum length check (say max 16 characters)
  //   if (value.length >= 16 && input.selectionStart === input.selectionEnd) {
  //     event.preventDefault();
  //     this.showAlert('DL number cannot exceed 16 characters.', 'danger');
  //     return;
  //   }

  //   // Position-based validation
  //   if (pos < 2) {
  //     // First two characters: letters
  //     if (!/^[A-Z]$/.test(key)) {
  //       event.preventDefault();
  //       this.showAlert('First two characters must be letters (A-Z).', 'danger');
  //     }
  //   } else if (pos >= 2 && pos < 4) {
  //     // Next two characters: digits
  //     if (!/^[0-9]$/.test(key)) {
  //       event.preventDefault();
  //       this.showAlert('Characters 3 and 4 must be digits (0-9).', 'danger');
  //     }
  //   } else if (pos >= 4) {
  //     // Remaining characters: letters or digits
  //     if (!/^[A-Z0-9]$/.test(key)) {
  //       event.preventDefault();
  //       this.showAlert('Only letters and digits allowed after position 4.', 'danger');
  //     }
  //   }
  // }

  toUppercase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }


  onLanguageSelect(id: number, event: any) {
    const selectedLanguages = this.registrationForm.get('knownLanguages')?.value || [];

    if (event.target.checked) {
      selectedLanguages.push(id);
    } else {
      const index = selectedLanguages.indexOf(id);
      if (index >= 0) selectedLanguages.splice(index, 1);
    }

    this.registrationForm.get('knownLanguages')?.setValue(selectedLanguages);
  }

  getSelectedLanguageNames(): string {
    const selectedIds = this.registrationForm.get('knownLanguages')?.value || [];
    const count = selectedIds.length;

    if (count === 0) return 'Select Languages';
    if (count === 1) return '1 Language Selected';
    return `${count} Languages Selected`;
  }

  showLanguageDropdown = false;

  toggleLanguageDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  // Example: in your component.ts

  onDOBChange(selectedDate: Date) {
    if (selectedDate) {
      const today = new Date();
      let age = today.getFullYear() - selectedDate.getFullYear();
      const m = today.getMonth() - selectedDate.getMonth();

      // If birth month/day has not occurred yet this year, subtract 1
      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
        age--;
      }

      // Patch the value to familyAge form control
      this.registrationForm.patchValue({
        familyAge: age
      });
    } else {
      this.registrationForm.patchValue({
        familyAge: ''
      });
    }
  }

  onIsExpiredChange(event: any) {
    const selectedValue = +event.target.value; // convert to number
    if (selectedValue === 1) {
      // Yes → Inactive
      this.registrationForm.get('familyStatus')?.setValue(2);
    } else if (selectedValue === 2) {
      // No → Active
      this.registrationForm.get('familyStatus')?.setValue(1);
    } else {
      this.registrationForm.get('familyStatus')?.setValue('');
    }
  }



  // FamilyInfoData = [
  //   {
  //     id: 1,
  //     firstName: "John",
  //     lastName: "Doe",
  //     relationId: 1,
  //     relationName: "Father",
  //     dob: "1965-08-10",
  //     contactNumber: "9876543210",
  //     gender: 1,
  //     bloodGroup: 1,
  //     isDependent: 0,
  //     isExpired: 0,
  //     isPfNominee: 1,
  //     isGraduityNominee: 1,
  //     occupation: "Retired",
  //     age: 60,
  //     familyStatus: 1,
  //     familyAadharFileName: "FatherAadhar.pdf",
  //     familyAadharFileUrl: "https://example.com/files/FatherAadhar.pdf"
  //   },
  //   {
  //     id: 2,
  //     firstName: "Jane",
  //     lastName: "Doe",
  //     relationId: 2,
  //     relationName: "Mother",
  //     dob: "1968-02-15",
  //     contactNumber: "9876543211",
  //     gender: 2,
  //     bloodGroup: 2,
  //     isDependent: 0,
  //     isExpired: 0,
  //     isPfNominee: 0,
  //     isGraduityNominee: 0,
  //     occupation: "Homemaker",
  //     age: 56,
  //     familyStatus: 1,
  //     familyAadharFileName: "MotherAadhar.pdf",
  //     familyAadharFileUrl: "https://example.com/files/MotherAadhar.pdf"
  //   },
  //   {
  //     id: 3,
  //     firstName: "Emily",
  //     lastName: "Doe",
  //     relationId: 3,
  //     relationName: "Daughter",
  //     dob: "1995-12-01",
  //     contactNumber: "9876543212",
  //     gender: 2,
  //     bloodGroup: 1,
  //     isDependent: 1,
  //     isExpired: 0,
  //     isPfNominee: 0,
  //     isGraduityNominee: 0,
  //     occupation: "Software Engineer",
  //     age: 28,
  //     familyStatus: 1,
  //     familyAadharFileName: "EmilyAadhar.pdf",
  //     familyAadharFileUrl: "https://example.com/files/EmilyAadhar.pdf"
  //   },
  //   {
  //     id: 4,
  //     firstName: "Michael",
  //     lastName: "Doe",
  //     relationId: 4,
  //     relationName: "Son",
  //     dob: "2000-06-20",
  //     contactNumber: "9876543213",
  //     gender: 1,
  //     bloodGroup: 2,
  //     isDependent: 1,
  //     isExpired: 0,
  //     isPfNominee: 0,
  //     isGraduityNominee: 0,
  //     occupation: "Student",
  //     age: 23,
  //     familyStatus: 1,
  //     familyAadharFileName: "",
  //     familyAadharFileUrl: ""
  //   }
  // ];


  deleteFamilyMember(id: number) {
    console.log(" sno : ", id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this family member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.existingCandidates.splice(index, 1);
        // Swal.fire('Deleted!', 'Family member has been removed.', 'success');
        // return;
        this.isLoading = true;
        this.authService.deleteFamilyMember(id).subscribe({
          next: (res: any) => {
            console.log(res);
            this.isLoading = false;
            this.loadUserData();
            Swal.fire('Deleted!', 'Family member has been removed.', 'success');
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            console.warn(err)
          }
        })
      }
    });
  }

  searchEmployee(): void {
    if (!this.searchEmpId) {
      this.showAlert('Please enter a valid Employee ID', 'danger');
      return;
    }
    const base64Once = btoa(this.searchEmpId.toString());
    const base64Twice = btoa(base64Once);
    this.router.navigate(['/onboarding-data', base64Twice]);
    this.empId = this.searchEmpId;
    this.loadUserData();
    this.searchEmpId = '';
    this.activeTab = 'personal';
  }

  onReporteeChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue) {
      this.hodName(selectedValue);
    }
  }

  toDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  FinalMoveToHrms(action: string, body: any) {
    console.log("Action : ", action);
    console.log("finla move to HRMS");
    alert(`candidate id : ${this.empId}`);

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
        this.authService.finalMoveToHRMS(body).subscribe({
          next: (res: HttpResponse<any>) => {
            console.log("final move to hrms", res);
            this.loadUserData();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Successfully Completed to Move to HRMS'
            })
          },
          error: (err: HttpErrorResponse) => {
            console.log("error : ", err)
          }
        });
      }
    })
  }

}

