import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.sass']
})
export class CardTemplateComponent implements OnInit {
  hoverIndex: { [key: string]: boolean } = {};
  loggedUser: any = {};
  userData: any;
  myDate: any;
  activeTab: string = 'HHCL';
  logo: string = 'https://sso.heterohealthcare.com/iconnect/assets/img/logo.svg';
  downloadValue: boolean = false;


  downloadIcon = 'assets/img/idcard/download.svg';
  companiesImage: any[] = [];
  baseUrl = 'https://raw.githubusercontent.com/rajendernaik925/companies-data/main/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {


    this.activeTab = 'HHCL'

    this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(this.loggedUser);
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));

    this.http.get<any[]>(this.baseUrl + 'companies.json')
      .subscribe(data => {
        this.companiesImage = data.map(company => ({
          ...company,
          images: company.images.map(img => ({
            ...img,
            url: this.baseUrl + encodeURIComponent(img.url)
          }))
        }));
      });
  }

  companies = [
    {
      name: 'HHCL',
      images: [
        { label: 'Front', url: 'assets/img/idcard/Hhcl-1.jpg' },
        { label: 'Back', url: 'assets/img/idcard/HHcl back.jpg' }
      ]
    },
    {
      name: 'Azista Composites',
      images: [
        { label: 'Front', url: 'assets/img/idcard/Azista Composites ID.jpg' },
        { label: 'Back', url: 'assets/img/idcard/Azista Composites  ID Card-back.jpg' }
      ]
    },
    {
      name: 'Azista Aerospace',
      images: [
        { label: 'Front', url: 'assets/img/idcard/Azista Aerospace ID.jpg' },
        { label: 'Back', url: 'assets/img/idcard/back-2.jpg' }
      ]
    },
    {
      name: 'Azista BST',
      images: [
        { label: 'Front', url: 'assets/img/idcard/Azista BST ID card.jpg' },
        { label: 'Back', url: 'assets/img/idcard/back-3.jpg' }
      ]
    },
    {
      name: 'Assam Unit-Ⅰ',
      images: [
        { label: 'Front', url: 'assets/img/idcard/Hhcl-1.jpg' },
        { label: 'Back', url: 'assets/img/idcard/assam-unit-1.PNG' }
      ]
    },
    {
      name: 'Assam Unit-ⅠⅠ',
      images: [
        { label: 'Front', url: 'assets/img/idcard/Hhcl-1.jpg' },
        { label: 'Back', url: 'assets/img/idcard/assam-unit-2.PNG' }
      ]
    }
  ];

  downloadImage(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substring(url.lastIndexOf('/') + 1);
    link.click();
  }


    setActiveSection(section: string) {
    this.activeTab = section;

    // Object.keys(this.registrationForm.controls).forEach(field => {
    //   const control = this.registrationForm.get(field);
    //   if (control) {
    //     control.markAsUntouched();
    //     control.markAsPristine();
    //     control.updateValueAndValidity();
    //   }
    // });
  }

}
