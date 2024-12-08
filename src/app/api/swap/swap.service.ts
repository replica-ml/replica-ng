import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, Observable, of } from 'rxjs';

import { ISwapPostRequest, ISwapPostResponse } from "./swap.interfaces";


@Injectable()
export class SwapService {
  swapCache: Map<string/*scrape url*/, string/*result url*/> = new Map<string, string>();

  constructor(private http: HttpClient) {
  }

  post(scrape: ISwapPostRequest): Observable<ISwapPostResponse> {
    const cache_key = `${scrape.model_img_url}_${scrape.user_img_url}`;
    if (this.swapCache.has(cache_key)) {
      return of<ISwapPostResponse>({
        output_url: this.swapCache.get(cache_key) as string,
        status: "processed"
      })
    } else {
      return this.http
        .post<ISwapPostResponse>('/v1/swap', scrape)
        .pipe(r => {
          lastValueFrom(r).then(res => {
            if (res.status === "processed") {
              this.swapCache.set(cache_key, res.output_url)
            }
          })
          return r
        });
    }
  }
}
