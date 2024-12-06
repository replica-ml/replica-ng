import { Injectable } from '@angular/core';

import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataUrlService {
  userPhotoUrl$ = new Subject<string>();
  modelPhotoUrl$ = new Subject<string>();
}
