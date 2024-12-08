import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, Observable, of } from 'rxjs';

import { IScraperGetBodyResponse, IScraperPostBody, IScraperPostBodyResponse } from "./scrape.interfaces";


@Injectable()
export class ScrapeService {
  scrapedCache: Map<string/*scrape url*/, string/*result url*/> = new Map<string, string>();

  constructor(private http: HttpClient) {
  }

  post(scrape: IScraperPostBody): Observable<IScraperPostBodyResponse> {
    if (this.scrapedCache.has(scrape.url)) {
      return of({
        success: true,
        id: this.scrapedCache.get(scrape.url)!,
        url: scrape.url
      })
    } else {
      return this.http
        .post<IScraperPostBodyResponse>('/v1/crawl', scrape)
        .pipe(r => {
          lastValueFrom(r).then(res => {
            if (res.success) {
              this.scrapedCache.set(scrape.url, res.url
                .replace('https://localhost:3002/v1/crawl/', '')
                .replace('https://localhost:4200/v1/crawl/', '')
              )
            }
          })
          return r
        });
    }
  }

  get(id: string): Observable<IScraperGetBodyResponse> {
    return this.http
      .get<IScraperGetBodyResponse>(`/v1/crawl/${id}`);
  }
}
