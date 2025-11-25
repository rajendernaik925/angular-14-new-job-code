import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-testing-purpose',
  templateUrl: './testing-purpose.component.html',
  styleUrls: ['./testing-purpose.component.sass']
})
export class TestingPurposeComponent implements AfterViewInit, OnInit {

  // @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  private redirected = false;
  a: number | null = 0;
  b: number | null = 0;
  myVideo: any;
  devId: string = '';
  
  ngOnInit(): void {
    // this.checkVideoTime();
    // this.adding(1,1);

    //  setTimeout(() => {
    //   this.showSurprise = true;
    // }, 5000);
    this.devId = 'DEV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  }

  showSurprise = false;  // Button clicked
  showSparkles = false;  // Show sparkles
  showCard = false;      // Show marquee card

  openSurprise() {
    this.showSurprise = true;
    this.showSparkles = true;

    // Show sparkles for 2 seconds, then show marquee card
    setTimeout(() => {
      this.showSparkles = false;
      this.showCard = true;
    }, 2000);
  }

  adding(a: any, b: any) {
    this.a = Math.max(0, a);
    this.b = Math.max(0, b);
  }

  reset(a: any, b: any) {
    if (a === 0 && b === 0) {
      alert("this is already cleared")
    } else {
      this.adding(0, 0);
    }
  }

  ngAfterViewInit(): void {
    const video = this.myVideo.nativeElement;
    // Try to play the video
    video.play().then(() => {
      // Enter fullscreen mode after video starts
      this.openFullscreen(video);
    }).catch(err => {
      console.warn("Autoplay blocked by browser, user interaction needed:", err);
    });
  }

  checkVideoTime() {
    const video = this.myVideo.nativeElement;

    if (video.currentTime >= 13 && !this.redirected) {
      this.redirected = true;
      video.pause();
      // Update browser history to avoid back navigation issues
      history.pushState({ redirectFromVideo: true }, '', '/dashboard');

      // Redirect
      window.open('https://www.flipkart.com/', '_self');
    }
  }

  private openFullscreen(video: HTMLVideoElement) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) { // Safari
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).mozRequestFullScreen) { // Firefox
      (video as any).mozRequestFullScreen();
    } else if ((video as any).msRequestFullscreen) { // IE/Edge
      (video as any).msRequestFullscreen();
    }
  }
}
