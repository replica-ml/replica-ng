import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

import { lastValueFrom, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { IScraperGetBodyResponse, ScrapeService } from "../api/scrape/scrape.service";
import { SecretService } from "./secret-service.service";
import { DataUrlService } from "../data-url.service";


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
  showPhotoStep = true;
  showLookStep = true;

  constructor(private secretService: SecretService,
              private scrapeService: ScrapeService,
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
    const url = this.scrapeControl.value;
    if (url != null) {
      lastValueFrom(this.scrapeService
        .post({url}))
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
}
