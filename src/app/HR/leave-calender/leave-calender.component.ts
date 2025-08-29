import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leave-calender',
  templateUrl: './leave-calender.component.html',
  styleUrls: ['./leave-calender.component.sass']
})
export class LeaveCalenderComponent implements OnInit {

  logo: string = 'https://sso.heterohealthcare.com/iconnect/assets/img/logo.svg';
  activeParentId: number | null = null;
  activeChildId: number | null = null;
  selectedEmpLeaves: any[] = [];
  isCard: boolean = false;
  clickedName: string | null = null;

  employeeList = [
    {
      id: 1,
      name: 'Venu Babu',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '3', mar: '4', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: [
        {
          id: 11,
          name: 'Rajendra Naik',
          leaves: [
            { jan: '0', feb: '4', mar: '1', apr: '3', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '2', dec: '4', tot: '45', used: '30', remaining: '15' }
          ],
          children: [
            {
              id: 111,
              name: 'Naik',
              leaves: [
                { jan: '0', feb: '4', mar: '1', apr: '3', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '2', dec: '4', tot: '45', used: '30', remaining: '15' }
              ]
            },
          ]
        },
        {
          id: 12,
          name: 'Anusha',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 13,
          name: 'Deepthi',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 14,
          name: 'Sirisha',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 15,
          name: 'Venkateshwarlu',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 16,
          name: 'Sneha',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 17,
          name: 'Srivalli',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 18,
          name: 'Durga Prasad',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 19,
          name: 'Upendra',
          leaves: [
            { jan: '1', feb: '0', mar: '2', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
      ]
    },
    {
      id: 2,
      name: 'Srinivas',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: [
        {
          id: 21,
          name: 'Divya',
          leaves: [
            { jan: '2', feb: '3', mar: '4', apr: '0', may: '5', jun: '3', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        },
        {
          id: 22,
          name: 'Sanjana',
          leaves: [
            { jan: '3', feb: '3', mar: '1', apr: '0', may: '1', jun: '2', jul: '4', aug: '1', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Karthik',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 4,
      name: 'Bharath',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 5,
      name: 'Chandu',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 6,
      name: 'Rajender',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 7,
      name: 'Anusha',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 8,
      name: 'Durga',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 9,
      name: 'Venky',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 10,
      name: 'Deepthi',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 11,
      name: 'mike',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 12,
      name: 'hank',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 13,
      name: 'hindu',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 14,
      name: 'bindu',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
    {
      id: 15,
      name: 'Bhaskar',
      expanded: false,
      allLeaves: [
        { jan: '2', feb: '1', mar: '4', apr: '2', may: '5', jun: '0', jul: '4', aug: '2', sep: '4', oct: '1', nov: '1', dec: '4', tot: '45', used: '30', remaining: '15' }
      ],
      children: []
    },
  ];



  constructor() { }

  ngOnInit() {
    // By default select the first parent employee
    if (this.employeeList.length > 0) {
      this.toggleParent(this.employeeList[0]);
    }
  }

  toggleParent(emp: any) {
    this.isCard = false;
    // Collapse all other parents
    this.employeeList.forEach(e => {
      if (e.id !== emp.id) e.expanded = false;
    });

    emp.expanded = !emp.expanded;
    this.activeParentId = emp.id;
    this.activeChildId = null;
    this.selectedEmpLeaves = emp.allLeaves || [];
  }

  selectChild(parentId: number, childId: number, event: Event) {
    event.stopPropagation();
    this.isCard = false;

    this.activeParentId = parentId;
    this.activeChildId = childId;

    const parent = this.employeeList.find(e => e.id === parentId);
    const child = parent?.children.find(c => c.id === childId);

    this.selectedEmpLeaves = child?.leaves || [];
  }

  // expandChild(emp: any) {
  //   emp.expanded = !emp.expanded;
  // }

  months = [
    { name: 'Jan', key: 'jan' },
    { name: 'Feb', key: 'feb' },
    { name: 'Mar', key: 'mar' },
    { name: 'Apr', key: 'apr' },
    { name: 'May', key: 'may' },
    { name: 'Jun', key: 'jun' },
    { name: 'Jul', key: 'jul' },
    { name: 'Aug', key: 'aug' },
    { name: 'Sep', key: 'sep' },
    { name: 'Oct', key: 'oct' },
    { name: 'Nov', key: 'nov' },
    { name: 'Dec', key: 'dec' },
  ];

  getParentName(id: number | null): string {
    return this.employeeList.find(e => e.id === id)?.name || '';
  }

  getParentChildren(id: number | null): any[] {
    return this.employeeList.find(e => e.id === id)?.children || [];
  }

  getParentLeaveValue(id: number | null, key: string): number {
    const parent = this.employeeList.find(e => e.id === id);
    return +parent?.allLeaves?.[0]?.[key] || 0;
  }


  showDataInCards(parentId: number, childId: number | null) {
    this.isCard = true;

    const parent = this.employeeList.find(emp => emp.id === parentId);

    if (childId) {
      this.activeChildId = childId;
      const child = parent?.children?.find(c => c.id === childId);
      this.selectedEmpLeaves = child?.leaves || [];

      this.clickedName = child?.name;
    } else {
      this.activeChildId = null;
      this.selectedEmpLeaves = parent?.allLeaves || [];

      this.clickedName = parent?.name
    }
  }

  back() {
    this.isCard = false;
  }
}
