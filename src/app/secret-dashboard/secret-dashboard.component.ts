import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

import { lastValueFrom, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { ScrapeService } from "../api/scrape/scrape.service";
import { IScraperGetBodyResponse } from "../api/scrape/scrape.interfaces";
import { ISwapPostResponse } from "../api/swap/swap.interfaces";
import { SwapService } from "../api/swap/swap.service";
import { DataUrlService } from "../data-url.service";
import { SecretService } from "./secret-service.service";
import { IErrorResponse } from "../api/shared";


@Component({
  selector: 'app-secret-dashboard',
  templateUrl: './secret-dashboard.component.html',
  styleUrls: ['./secret-dashboard.component.css'],
  standalone: false
})
export class SecretDashboardComponent implements OnInit {
  secret$!: Observable<string>;
  secretError$: Observable<any> = new Observable();

  scraped$!: Observable<IScraperGetBodyResponse>;

  swap$!: Observable<ISwapPostResponse>;
  httpError$!: Observable<IErrorResponse>;

  showPhotoStep = true;
  showLookStep = true;

  private url: string | null = null;

  constructor(private secretService: SecretService,
              private scrapeService: ScrapeService,
              private swapService: SwapService,
              protected dataUrlService: DataUrlService) {}

  ngOnInit(): void {
    this.secret$ = this.secretService.get();
    this.secretError$ = this.secret$.pipe(catchError((err) => of(err)))
  }

  scrapeControl = new FormControl('https://www.friartux.com/suits-tuxedos/navy-stretch-shawl-lapel-tuxedo-separates/FT-C5450.html', [Validators.required]);

  /*safe(url: string): string | null {
    return this.domSanitizer.sanitize(SecurityContext.URL, url)
    // return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }*/

  scrape() {
    this.url = this.scrapeControl.value;
    if (this.url != null) {
      lastValueFrom(this.scrapeService
        .post({url: this.url}))
        .then(scraped => {
          this.scraped$ = this.scrapeService
            .get(scraped.id);
          if (scraped.success) {
            this.scraped$.subscribe(scrapedRes => {
              if (scrapedRes.status == 'scraping') {
                setTimeout(() => {
                  console.log("Delayed for 5 seconds.");
                  this.scrape();
                }, 5000);
              }
            })
          }
        })
    }

    /*
    this.scrapeControl.valueChanges.subscribe(r => {
      console.info("scraping:", r);
    })
    */
  }

  setProfileUrl(ogImage: string): string {
    this.dataUrlService.modelPhotoUrl$.next(ogImage);
    return ogImage;
  }

  swap(userPhotoUrl: string | null, modelPhotoUrl: string | null) {
    if (userPhotoUrl == null || modelPhotoUrl == null) return;
    this.swap$ = this.swapService
      .post({user_img_url: userPhotoUrl, model_img_url: modelPhotoUrl})
    this.httpError$ = this.swap$.pipe(catchError((err) => of(err)));
  }

  fixMarkdownUrls(markdown: string): string {
    const { origin } = new URL(this.url as string);
    return markdown.replaceAll("](/", `](${origin}/`);
  }
}
