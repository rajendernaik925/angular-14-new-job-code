import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-testing-purpose',
  templateUrl: './testing-purpose.component.html',
  styleUrls: ['./testing-purpose.component.sass']
})
export class TestingPurposeComponent implements AfterViewInit, OnInit {

  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  private redirected = false;

  ngOnInit(): void {
    this.checkVideoTime();
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
