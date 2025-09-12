import { Component } from '@angular/core';
import { SessionService } from './session.service';
import { SessionTimeoutService } from './session-timeout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'iconnect';

  constructor(
    // private sessionService: SessionService,
    // private sessionTimeout: SessionTimeoutService
  ) { }

  ngOnInit(): void {
    // this.sessionService.checkSessionOnLoad();
    // this.sessionTimeout.startMonitoring();
  }

}
