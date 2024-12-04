import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, Observable, of } from 'rxjs';


export interface IScraperPostBodyResponse {
  success: boolean
  id: string
  url: string
}

export interface IScraperPostBody {
  url: string
}

export interface IScraperGetBodyResponse {
  completed: number
  creditsUsed: number
  data: Daum[]
  expiresAt: string
  status: string
  success: boolean
  total: number
}

export interface Daum {
  markdown: string
  metadata: Metadata
}

export interface Metadata {
  description: string
  keywords: string
  "og:image": string
  "og:title": string
  "og:url": string
  ogImage: string
  ogLocaleAlternate: any[]
  ogTitle: string
  ogUrl: string
  "p:domain_verify": string
  sourceURL: string
  statusCode: number
  title: string
  url: string
  viewport: string
}

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
