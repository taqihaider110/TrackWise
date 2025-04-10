import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavService {

  private previousUrl: string | null = null;
  private currentUrl: string | null = null;
  //
  constructor(
    public location: Location,
    public router: Router,
    //  private nativePageTransitions: NativePageTransitions
    public activatedRoute: ActivatedRoute
  ) {

    this.currentUrl = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });

  }

  public getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  public getPublicUrl(): string | null {
    return this.currentUrl;
  }

  async setRoot(page: any, param = {}) {
    // await this.nativePageTransitions.fade(null);
    const extras: NavigationExtras = {
      queryParams: param,
    };
    this.navigateTo(page, extras);
  }

  async push(page: any, param = {}) {
    // this.options.direction = 'left';
    // await this.nativePageTransitions.slide(this.options);
    const extras: NavigationExtras = {
      queryParams: param,
    };
    this.navigateTo(page, extras);
  }

  async pop1(data: any) {
    return new Promise<void>(async (resolve) => {
      this.location.back();
      resolve(data);
    });
  }

  async pop(link = '') {
    return new Promise<void>(async (resolve) => {
      // ;
      if(link){
        this.router.navigate([link], {});
      } else {
        this.router.navigate(['..'], {});
      }

      resolve();
    });
  }

  navigateTo(link: any, data?: NavigationExtras) {
    this.router.navigate([link], data);
  }

  navigateToChild(link: any, data?: NavigationExtras) {
    this.router.navigate([link], data);
  }

  getParams() {
    return this.activatedRoute.snapshot.params;
  }

  getQueryParams() {
    return this.activatedRoute.snapshot.queryParams;
  }
}
