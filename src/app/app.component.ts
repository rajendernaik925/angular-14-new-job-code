import { Component, OnInit } from '@angular/core';
// import { SessionService } from './session.service';
// import { SessionTimeoutService } from './session-timeout.service';
// import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'iconnect';
  // hideFooter = false;


  constructor(
    // private sessionService: SessionService,
    // private sessionTimeout: SessionTimeoutService,
    // private router: Router
  ) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // Hide footer only for set-password route
    //     this.hideFooter = event.urlAfterRedirects.includes('set-password');
    //   }
    // });
   }

  ngOnInit(): void {
    // this.sessionService.checkSessionOnLoad();
    // this.sessionTimeout.startMonitoring();
  }

}
