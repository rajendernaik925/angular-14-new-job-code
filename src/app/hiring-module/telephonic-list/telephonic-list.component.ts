import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  reprocessForm: FormGroup;
  feedbackFactorsData: any[] = [];
  audio: any;
  currentPage = 1;
  pageSize = 9;
  comapnyLogo: string = 'assets/img/icons/company-name.png'
  @ViewChild('aboutCandidateDialog', { static: true }) aboutCandidateDialog!: TemplateRef<any>;
  @ViewChild('reprocess', { static: true }) reprocess!: TemplateRef<any>;
  // @ViewChild('reject', { static: true }) reject!: TemplateRef<any>;
  searchQueryText: string;
  selectedInterviewerId: string | null = null;
  interviewedByList: any[] = [];
  interviewRounds: any[] = [];
  candidateId: any;
  interviewScheduledId: any;
  userData: any;
  UserId: number | null = null;
  commentReqValue: boolean = false;





  constructor(
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

    this.reprocessForm = this.fb.group({
      comments: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.telephonicCandidates();
    this.generateColumns();
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
      this.reprocessForm.markAllAsTouched();
      this.commentReqValue = true;
      return;
    }
    const payload = {
      candidateId: this.candidateId,
      status: 1004,
      comments: this.reprocessForm.value.comments,
      loginId: this.UserId,
      interviewScheduledId: this.interviewScheduledId,
    };

    console.log("voice reject payload ", payload);
    return;
    this.authService.feedbackSubmitForm(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.close();
        this.telephonicCandidates();
        Swal.fire({
          title: 'Success',
          text: res?.message || "Operation completed successfully",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      },
      error: (_: HttpErrorResponse) => {
        this.isLoading = false;
      }
    });
  }


  telephonicCandidates() {
    this.isLoading = true;
    this.authService.telephonicCandidates().subscribe({
      next: (res: any) => {
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
          const interviewScheduledId = item.interviewRoundInfo?.sno;
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
            interviewScheduledId: interviewScheduledId ?? null,
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

  close() {
    this.dialog.closeAll();
  }

  // rejectHrCandidate(candidateId: number, interviewScheduledId: any) {
  //   console.log("candidate id : ", candidateId);
  //   this.candidateId = candidateId;
  //   this.interviewScheduledId = interviewScheduledId;
  //   Swal.fire({
  //     html: `
  //     <div class="mb-3">
  //       <img src="https://i.pinimg.com/originals/c3/c4/70/c3c470ab294138c5c52a1372911422e4.gif" alt="delete" style="width:80px; height:60px; border-radius: 15px;" />
  //     </div>
  //     <h5 class="mb-2" style="font-weight: bold;">Are you sure you want to Reject this Candidate?</h5>
  //     <p class="text-muted mb-0" style="font-size: 14px;">
  //       This will stop the interview process and mark the candidate as rejected.
  //     </p>
  //   `,
  //     showCancelButton: true,
  //     cancelButtonText: 'Cancel',
  //     confirmButtonText: 'Reject',
  //     reverseButtons: true,
  //     customClass: {
  //       popup: 'p-3 rounded-4',
  //       htmlContainer: 'text-center',
  //       actions: 'd-flex justify-content-center',
  //       cancelButton: 'btn btn-info btn-sm shadow-none mr-2',
  //       confirmButton: 'btn btn-danger btn-sm shadow-none'
  //     },
  //     buttonsStyling: false,
  //     width: '550px',
  //     backdrop: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // api call
  //     }
  //   });
  // }

  rejectHrCandidate(candidateId: number, interviewScheduledId: any) {
    console.log("candidate id : ", candidateId);
    this.candidateId = candidateId;
    this.interviewScheduledId = interviewScheduledId;

    Swal.fire({
      title: 'Reject Candidate',
      html: `
      <p class="text-muted mb-3" style="font-size: 14px;">
        Please provide a reason for rejecting this candidate.
      </p>
      <textarea id="rejectReason" 
                class="form-control" 
                placeholder="Enter rejection reason..." 
                rows="3"></textarea>
    `,
      confirmButtonText: 'Submit',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'p-3 rounded-4',
        htmlContainer: 'text-center',
        actions: 'd-flex justify-content-center',
        cancelButton: 'btn btn-danger btn-sm shadow-none mr-2',
        confirmButton: 'btn btn-primary btn-sm shadow-none'
      },
      buttonsStyling: false,
      width: '550px',
      backdrop: true,
      preConfirm: () => {
        const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement)?.value;
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Rejection reason is required!');
          return false;
        }
        return reason.trim();
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const rejectionReason = result.value;
        // console.log("Reject Payload:", {
        //   candidateId: candidateId,
        //   interviewScheduledId: interviewScheduledId,
        //   comments: rejectionReason
        // });

        const payload = {
          candidateId: this.candidateId,
          status: 1005,
          comments: rejectionReason,
          loginId: this.UserId,
          interviewScheduledId: this.interviewScheduledId,
          feedbackList: [
            {
              "factorId": 1,
              "feedbackId": 4
            }
          ],
        };

        console.log("payload : ", payload);

        this.authService.feedbackSubmitForm(payload).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.close();
            this.telephonicCandidates();
            Swal.fire({
              title: 'Success',
              text: res?.message || "Candidate Rejected Successfully",
              icon: 'success',
              showConfirmButton: true,
            });
          },
          error: (_: HttpErrorResponse) => {
            this.isLoading = false;
          }
        });

        // 🔥 API Call here
        // this.hrService.rejectCandidate({ candidateId, interviewScheduledId, comments: rejectionReason }).subscribe(...)
      }
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
  }

  feedbackFactors() {
    this.authService.feedbackFactors().subscribe({
      next: (res: any) => {
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



