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

  downloadIcon = 'assets/img/idcard/download.svg';

  ngOnInit(): void {
    this.loggedUser = decodeURIComponent(window.atob(localStorage.getItem('userData')));
    this.userData = JSON.parse(this.loggedUser);
    this.myDate = decodeURIComponent(window.atob(localStorage.getItem('currentDate')));
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
    }
  ];

  downloadImage(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substring(url.lastIndexOf('/') + 1);
    link.click();
  }

}
