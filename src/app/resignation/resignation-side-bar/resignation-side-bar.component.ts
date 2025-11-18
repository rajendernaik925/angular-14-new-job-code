import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-resignation-side-bar',
  templateUrl: './resignation-side-bar.component.html',
  styleUrls: ['./resignation-side-bar.component.sass']
})
export class ResignationSideBarComponent implements OnInit {

  activeTab: string | null = null;
  isSidebarOpen: boolean = false;

  sidebarItems = [
    {
      label: 'Manager Approvals',
      route: '/resignation-list',
      matchRoutes: ['/resignation-list'],
      icon: 'bi bi-person-check'
    },
    {
      label: 'HR Approvals',
      route: '/resignation-hr-list',
      matchRoutes: ['/resignation-hr-list'],
      icon: 'bi bi-briefcase'
    },
    {
      label: 'Clearence Requests',
      route: '/resignation-clearence',
      matchRoutes: ['/resignation-clearence'],
      icon: 'bi bi-briefcase'
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set active tab initially
    this.updateActiveTab(this.router.url);

    // Update active tab on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveTab((event as NavigationEnd).urlAfterRedirects);
      });
  }

  updateActiveTab(url: string): void {
    this.activeTab = url;
  }

  isRouteActive(item: any): boolean {
    if (item.matchRoutes && Array.isArray(item.matchRoutes)) {
      return item.matchRoutes.some(route => this.activeTab?.startsWith(route));
    }
    return this.activeTab?.startsWith(item.route) ?? false;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
