import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { title } from 'process';
import { debounceTime } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-telephonic-list',
  templateUrl: './telephonic-list.component.html',
  styleUrls: ['./telephonic-list.component.sass']
})
export class TelephonicListComponent implements OnInit {


  columns: { key: string; label: string; center?: boolean; uppercase?: boolean; clickable?: boolean; minKey?: string; maxKey?: string }[] = [];
  rows: any[] = [];
  originalRows: any[] = [];
  searchQuery: FormControl = new FormControl();
  filteredRows: any[] = [];
  filterOffcanvas: any;
  isOpen = false;
  private dialogRef: any;
  candidateData: any = null;
  isLoading: boolean = false;
  feedbackForm: FormGroup;
  feedbackFactorsData: any[] = [];
  audio: any;
  currentPage = 1;
  pageSize = 9;
  comapnyLogo: string = 'assets/img/icons/company-name.png'
  @ViewChild('aboutCandidateDialog', { static: true }) aboutCandidateDialog!: TemplateRef<any>;
  @ViewChild('reprocess', { static: true }) reprocess!: TemplateRef<any>;
  searchQueryText: string;
  selectedInterviewerId: string | null = null;
  selectedInterviewerName: any;
  showDropdown: boolean = false;
  interviewedByList: any[] = [];
  interviewRounds: any[] = [];
  candidateId: any;
  userData: any;
  UserId: number | null = null;

  reprocessForm = this.fb.group({
    interviewRound: ['', Validators.required],
    interviewBy: ['', Validators.required],
  });


  constructor(
    private render: Renderer2,
    private dialog: MatDialog,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      comments: ['', Validators.required],
      status: ['', Validators.required],
      interviewRound: [null, Validators.required],
      interviewBy: ['', Validators.required],
      feedbackList: this.fb.array([]),
      joiningDate: ['', Validators.required],
      expectedCTC: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      division: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      state: ['', Validators.required],
      hq: ['', Validators.required],
      region: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.telephonicCandidates();
    this.generateColumns();
    this.totalInterviewRounds();
    this.feedbackFactors();
    // this.generateRows();
    let loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(loggedUser);
    this.UserId = this.userData.user.empID;

    // this.filteredRows = [...this.rows];

    this.searchQuery.valueChanges.subscribe((value: string) => {
      console.log(value);
      this.currentPage = 1;
      this.searchQueryText = value.trim().toLowerCase(); // Store search text
      this.filterRows(value);
    });
  }






  submitFeedback() {

    if (!this.reprocessForm.valid) {
      // Swal.fire('warning!', 'please fill all fields.', 'warning');
      this.reprocessForm.markAllAsTouched();
      return;
    }
    const payload = {
      candidateId: this.candidateId,
      status: 1004,
      interviewBy: this.reprocessForm.value.interviewBy,
      interviewRound: this.reprocessForm.value.interviewRound,
      loginId: this.UserId,
    };

    console.log(payload);

    this.authService.techHoldProeccess(payload).subscribe({
      next: (res: any) => {
        Swal.fire('Reprocess!', 'Candidate has been reprocess.', 'success');
        this.telephonicCandidates();
        this.close();
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error reprocessing candidate:", err);
        Swal.fire('Error!', 'Something went wrong while rejecting.', 'error');
      }
    });
  }


  telephonicCandidates() {
    this.isLoading = true;
    this.authService.telephonicCandidates().subscribe({
      next: (res: any) => {
        console.log("hold candidates : ", res);
        this.isLoading = false;

        // this.rows = res.map((item: any, index: number) => ({
        //   jobcodeId: item.jobcodeId || 'N/A',
        //   jcReferanceId: item.jcReferanceId || 'N/A',
        //   candidateId: item.candidateId || 'N/A',
        //   name: item.name || 'N/A',
        //   jobTitleName: item.jobTitleName || 'N/A',
        //   mobileNumber: item.mobileNumber || 'N/A',
        //   email: item.email || 'N/A',
        //   teamName: item.teamName || 'N/A',
        //   reportingManager: item.reportingManager || 'N/A',
        //   createdBy: item.createdBy || 'N/A',
        //   // status: item.status || 'N/A'
        // }));

        this.rows = res.map((item: any) => {
          // let statusDescription = '';

          const round = item.interviewRoundInfo?.interviewRound;
          const roundStatus = item.interviewRoundInfo?.status;

          // if (roundStatus === '1006') {
          //   if (round === 1) statusDescription = 'Hold at Interviewer';
          //   else if (round === 2) statusDescription = 'Hold at Manager';
          //   else if (round === 3) statusDescription = 'Hold at HR';
          // }

          return {
            jobcodeId: item.jobcodeId || 'N/A',
            jcReferanceId: item.jcReferanceId || 'N/A',
            candidateId: item.candidateId || 'N/A',
            name: item.name || 'N/A',
            jobTitleName: item.jobTitleName || 'N/A',
            mobileNumber: item.mobileNumber || 'N/A',
            email: item.email || 'N/A',
            // statusDescription: statusDescription || 'Hold at interviewer', 
            interviewRound: round ?? null,
          };
        });




        // Ensure at least 100 dummy entries
        // while (this.rows.length < 10) {
        //   const dummyIndex = this.rows.length + 1;
        //   this.rows.push({
        //     jobcodeId: 1000 + dummyIndex,
        //     jcReferanceId: `JC${1000 + dummyIndex}`,
        //     candidateId: dummyIndex,
        //     name: `Candidate ${dummyIndex}`,
        //     jobTitleName: `Job Title ${dummyIndex}`,
        //     mobileNumber: `987654${String(dummyIndex).padStart(4, '0')}`,
        //     email: `dummy${dummyIndex}@example.com`,
        //     teamName: `Team ${dummyIndex}`,
        //     reportingManager: `Manager ${dummyIndex}`,
        //     createdBy: `Creator ${dummyIndex}`,
        //     // status: dummyIndex % 3 === 0 ? 1001 : dummyIndex % 3 === 1 ? 1003 : 1005
        //   });
        // }

        this.originalRows = [...this.rows];
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
      }
    });
  }

  generateColumns() {
    this.columns = [
      { key: 'jcReferanceId', label: 'Job Code', uppercase: true },
      { key: 'email', label: 'Mail ID', uppercase: true },
      { key: 'name', label: 'Candidate Name', uppercase: true },
      { key: 'mobileNumber', label: 'Mobile', uppercase: true },
      { key: 'jobTitleName', label: 'Job Title', uppercase: true },
      // { key: 'statusDescription', label: 'Status', uppercase: true }, 
      { key: 'candidateId', label: 'Action', center: true, clickable: true }
    ];
  }



  filterRows(query: string) {
    const lowerCaseQuery = query.toLowerCase().trim();
    this.searchQueryText = lowerCaseQuery; // Store for highlighting

    this.rows = this.originalRows.filter(row =>
      Object.keys(row).some(key =>
        String(row[key]).toLowerCase().includes(lowerCaseQuery)
      )
    );
  }



  highlightMatch(text: any): SafeHtml {
    if (!this.searchQueryText || !text) return text;
    const escapedQuery = this.searchQueryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const highlightedText = String(text).replace(regex, `<span  style="font-weight: bold; color: #0072BC">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  handleAction(employeeId: any) {
    this.isLoading = true;
    this.authService.registeredData(employeeId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.candidateData = res;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log("error : ", err)
      }
    })
    this.dialogRef = this.dialog.open(this.aboutCandidateDialog, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true,
    });
  }

  close() {
    this.dialog.closeAll();
  }



  rejectHrCandidate(candidateId: number, interviewRound: number) {
    const rejectId = 1005;
    console.log("candidate id : ", candidateId);
    console.log("interview round : ", interviewRound);

    Swal.fire({
      html: `
          <div class="mb-3">
            <img src="https://i.pinimg.com/originals/c3/c4/70/c3c470ab294138c5c52a1372911422e4.gif" alt="delete" style="width:80px; height:60px; border-radius: 15px;" />
          </div>
          <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to Reject this Candidate?</h5>
          <p class="text-muted mb-0" style="font-size: 14px;">
            This will stop the interview process and mark the candidate as rejected.
          </p>
        `,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Reject',
      reverseButtons: true,
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        actions: 'd-flex justify-content-center',
        cancelButton: 'btn btn-info btn-sm shadow-none mr-2',
        confirmButton: 'btn btn-danger btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true
    }).then((result) => {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Need to implement'
      });
      // if (result.isConfirmed) {
      //   this.authService.HRHoldProeccess(candidateId, interviewRound, rejectId).subscribe({
      //     next: (res: any) => {
      //       console.log("Candidate rejected successfully:", res);
      //       Swal.fire({
      //         icon: 'success',
      //         title: 'Rejected!',
      //         text: 'Candidate has been rejected.',
      //         confirmButtonText: 'OK',
      //         confirmButtonColor: '#3085d6'
      //       });
      //       this.telephonicCandidates();
      //       this.reprocessForm.reset();
      //     },
      //     error: (err: HttpErrorResponse) => {
      //       console.error("Error rejecting candidate:", err);
      //       Swal.fire({
      //         icon: 'error',
      //         title: 'Error!',
      //         text: 'Something went wrong while rejecting the candidate.',
      //         confirmButtonText: 'OK',
      //         confirmButtonColor: '#d33'
      //       });
      //     }
      //   });
      // }
    });
  }

  approveHrCandidate(candidateId: any, interviewRound: any) {
    this.candidateId = candidateId;
    console.log("candidate id : ", candidateId);
    console.log("interview round : ", interviewRound);


    this.dialogRef = this.dialog.open(this.reprocess, {
      width: '600px',
      maxWidth: '90vw',
      height: 'auto',
      hasBackdrop: true
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.reprocessForm.reset({
        interviewRound: '',
        interviewBy: '',
      });
      this.selectedInterviewerName = '';
      this.showDropdown = false;
    });
  }
  feedbackFactors() {
    this.authService.feedbackFactors().subscribe({
      next: (res: any) => {
        // // console.log("Feedback factors : ", res);
        this.feedbackFactorsData = res;

        const feedbackArray = this.feedbackArray;
        feedbackArray.clear();

        res.forEach((factor: any) => {
          feedbackArray.push(this.fb.group({
            factorId: [factor.id, Validators.required],
            feedbackId: ['', Validators.required]
          }));
        });
      },
      error: (err: HttpErrorResponse) => {
        // console.log("Error fetching feedback factors: ", err);
      }
    });
  }

  get feedbackArray(): FormArray {
    return this.feedbackForm.get('feedbackList') as FormArray;
  }

 areRadioFieldsInvalid(): boolean {
  // Check if at least one factor has feedbackId selected
  return !this.feedbackArray.controls.some(
    control => !!control.get('feedbackId')?.value
  );
}



  selectInterviewer(interviewer: any) {
    this.selectedInterviewerId = interviewer.id;
    this.selectedInterviewerName = interviewer.name;
    this.reprocessForm.patchValue({ interviewBy: interviewer.id });

    this.showDropdown = false;
  }

  searchInterviewer(query: string) {
    if (query.trim().length < 3) {
      this.interviewedByList = [];
      return;
    }
    const formData = new FormData();
    formData.append("name", query)
    // Debounce API call
    this.authService.interviewedBy(formData).pipe(debounceTime(300)).subscribe({
      next: (res: any) => {
        this.interviewedByList = Array.isArray(res) ? res : [];
        this.showDropdown = this.interviewedByList.length > 0;
      },
      error: (err: HttpErrorResponse) => {
        this.interviewedByList = [];
      }
    });
  }

  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Delay to allow item selection before hiding
  }

  totalInterviewRounds() {
    this.authService.interviewRounds().subscribe({
      next: (res: any) => {
        // console.log("interview rounds : ", res);
        this.interviewRounds = res;
      },
      error: (err: HttpErrorResponse) => {
        // console.log("error : ", err)
      }
    })
  }

  get paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  get startIndex() {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex() {
    return Math.min(this.currentPage * this.pageSize, this.rows.length);
  }

  goBack() {
    window.history.back();
  }



}



