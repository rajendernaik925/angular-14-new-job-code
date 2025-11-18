import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resignation-list',
  templateUrl: './resignation-list.component.html',
  styleUrls: ['./resignation-list.component.sass']
})
export class ResignationListComponent implements OnInit {

  searchTerm: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  filteredList() {
    if (!this.searchTerm) return this.resignationList;
    const term = this.searchTerm.toLowerCase();
    return this.resignationList.filter(emp =>
      Object.values(emp).some(value =>
        value.toString().toLowerCase().includes(term)
      )
    );
  }


  resignationList = [
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending',
      comments: 'After a detailed discussion with the reporting manager and the employee, the resignation has been reviewed and approved. The employee has confirmed the decision to move forward due to career growth opportunities. All handover activities and knowledge transfer have been planned and scheduled. HR will coordinate with IT and Finance for final clearance and full & final settlement processing before the last working date. We appreciate the employee’s contribution to the organization and wish them continued success in their future endeavors.',
    },
    {
      name: 'Dasru Naik',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending',
      comments: 'After a detailed discussion with the reporting manager and the employee, the resignation has been reviewed and approved. The employee has confirmed the decision to move forward due to career growth opportunities. All handover activities and knowledge transfer have been planned and scheduled. HR will coordinate with IT and Finance for final clearance and full & final settlement processing before the last working date. We appreciate the employee’s contribution to the organization and wish them continued success in their future endeavors.',
    },
    {
      name: 'Dasru Naik',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending',
      comments: 'After a detailed discussion with the reporting manager and the employee, the resignation has been reviewed and approved. The employee has confirmed the decision to move forward due to career growth opportunities. All handover activities and knowledge transfer have been planned and scheduled. HR will coordinate with IT and Finance for final clearance and full & final settlement processing before the last working date. We appreciate the employee’s contribution to the organization and wish them continued success in their future endeavors.',
    },
    {
      name: 'Dasru Naik',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
    {
      name: 'Rajender Bhukya',
      empId: 'EMP101',
      designation: 'Frontend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Pending'
    },
    {
      name: 'Sai Kumar',
      empId: 'EMP102',
      designation: 'Backend Developer',
      department: 'IT',
      manager: 'Venu Babu Gurram',
      status: 'Approved'
    },
    {
      name: 'Anjali Reddy',
      empId: 'EMP103',
      designation: 'HR Executive',
      department: 'HR',
      manager: 'Rohit Sharma',
      status: 'Rejected'
    },
  ];

  viewDetails(emp: any): void {
    Swal.fire({
      html: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h5 class="text-dark mb-0">Resignation Details: ${emp.name}</h5>
        <button type="button" id="swalCloseBtn" style="
          background:none; 
          border:none; 
          font-size:20px; 
          cursor:pointer;
          color:#6c757d;
        ">&times;</button>
      </div>

      <div style="
        font-size:14px;
        border:1px solid #dee2e6;
        border-radius:6px;
        overflow:hidden;
      ">
        <table style="
          width:100%;
          border-collapse:collapse;
          font-family:Arial, sans-serif;
        ">
          <tbody>
            <tr style="background-color:#f8f9fa;">
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6; width:30%;">Employee Name</td>
              <td style="padding:8px; border:1px solid #dee2e6;">${emp.name}</td>
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6; width:30%;">Employee ID</td>
              <td style="padding:8px; border:1px solid #dee2e6;">${emp.empId}</td>
            </tr>
            <tr>
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Designation</td>
              <td style="padding:8px; border:1px solid #dee2e6;">${emp.designation}</td>
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Department</td>
              <td style="padding:8px; border:1px solid #dee2e6;">${emp.department}</td>
            </tr>
            <tr style="background-color:#f8f9fa;">
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Manager</td>
              <td style="padding:8px; border:1px solid #dee2e6;">${emp.manager}</td>
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Last Working Date</td>
              <td style="padding:8px; border:1px solid #dee2e6;">${emp.lastWorkingDate || 'Not decided'}</td>
            </tr>
            <tr>
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Reason</td>
              <td style="padding:8px; border:1px solid #dee2e6;" colspan="3">${emp.reason || 'N/A'}</td>
            </tr>
            <tr style="background-color:#f8f9fa;">
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Comments</td>
              <td style="padding:8px; border:1px solid #dee2e6;" colspan="3">${emp.comments || 'No comments provided'}</td>
            </tr>
            <tr>
              <td style="font-weight:600; padding:8px; border:1px solid #dee2e6;">Resignation Letter</td>
              <td style="padding:8px; border:1px solid #dee2e6;" colspan="3">
                ${emp.resignationLetter
          ? `<a href="${emp.resignationLetter}" target="_blank" class="btn btn-sm btn-outline-primary">View Letter</a>`
          : 'No file uploaded'
        }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Accept',
      denyButtonText: 'Retain',
      cancelButtonText: 'Close',
      confirmButtonColor: '#198754',
      denyButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      width: '1000px', // ⬅️ Increased width for better layout
    }).then((result) => {
      if (result.isConfirmed) {
        // 🔹 Ask for comments before acceptance
        Swal.fire({
          title: 'Comments Required',
          input: 'textarea',
          inputLabel: 'Please enter your comments before accepting:',
          inputPlaceholder: 'Enter HR remarks...',
          inputAttributes: { 'aria-label': 'Type your comments here' },
          showCancelButton: true,
          confirmButtonText: 'Submit',
          confirmButtonColor: '#198754',
          cancelButtonColor: '#6c757d',
          width: '750px',
          inputValidator: (value) => {
            if (!value) {
              return 'Please enter comments before proceeding!';
            }
            return null;
          },
        }).then((commentResult) => {
          if (commentResult.isConfirmed) {
            const hrComments = commentResult.value;
            console.log('✅ HR accepted resignation with comments:', hrComments);

            Swal.fire({
              icon: 'success',
              title: 'Accepted!',
              // html: `The resignation has been accepted.<br><b>Comments:</b> ${hrComments}`,
              confirmButtonColor: '#198754',
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire({
          // icon: 'info',
          title: 'Comment Required',
          input: 'textarea',         
          inputPlaceholder: 'Enter your comment here...',
          inputAttributes: {
            'aria-label': 'Type your comment'
          },
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#198754',
        }).then((commentResult) => {
          if (commentResult.isConfirmed) {
            const comment = commentResult.value;
            console.log('Retention comment:', comment);
            Swal.fire({ icon: 'success', title: 'Retention success!', text: 'The employee will be retained.', confirmButtonColor: '#198754', });
          }
        });
      }

    });
  }
}
