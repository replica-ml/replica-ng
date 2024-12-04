import { APP_BASE_HREF } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { concatMap, filter, fromEvent, Observable, scan, startWith, Subject, takeUntil, tap, timer } from "rxjs";
import { map } from "rxjs/operators";

import { NAVIGATOR } from "../core/navigator.service";
import { Photo } from "./webcam.interface";


@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class WebcamComponent implements OnInit, OnDestroy {
  @ViewChild('btnPhoto', { static: true, read: ElementRef })
  btnPhoto!: ElementRef<HTMLButtonElement>;

  @ViewChild('snap', { static: true, read: ElementRef })
  snap!: ElementRef<HTMLAudioElement>;

  @ViewChild('video', { static: true, read: ElementRef })
  video!: ElementRef<HTMLVideoElement>;

  @ViewChild('photo', { static: true, read: ElementRef })
  canvas!: ElementRef<HTMLCanvasElement>;

  destroy$ = new Subject<void>();

  photoStripe$!: Observable<Photo[]>;

  constructor(@Inject(APP_BASE_HREF) private baseHref: string, @Inject(NAVIGATOR) private navigator: Navigator) {}

  ngOnInit(): void {
    const videoNative = this.video.nativeElement;
    const canvasNative = this.canvas.nativeElement;
    const ctx = canvasNative.getContext('2d', { willReadFrequently: true });

    this.getVideo();

    this.photoStripe$ = fromEvent(this.btnPhoto.nativeElement, 'click').pipe(
      tap(() => {
        const snapElement = this.snap.nativeElement;
        snapElement.currentTime = 0;
        snapElement.play();
      }),
      map(() => ({
        data: this.canvas.nativeElement.toDataURL('image/jpeg'),
        description: 'My photo',
        download: 'photo',
      })),
      scan((photos, photo) => [photo, ...photos], [] as Photo[]),
      startWith([] as Photo[]),
    );

    fromEvent(videoNative, 'canplay')
      .pipe(
        filter(() => !!ctx),
        map(() => ctx as CanvasRenderingContext2D),
        concatMap((canvasContext) => {
          const width = videoNative.videoWidth;
          const height = videoNative.videoHeight;
          canvasNative.width = width;
          canvasNative.height = height;
          const interval = 16;

          return timer(0, interval).pipe(
            tap(() => {
              canvasContext.drawImage(
                this.video.nativeElement,
                0,
                0,
                width,
                height
              );
              // take the pixels out
              const pixels = canvasContext.getImageData(0, 0, width, height);

              //this.rgbSplit(pixels);
              canvasContext.globalAlpha = 0.8;
              canvasContext.putImageData(pixels, 0, 0);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getVideo() {
    console.log('navigator', this.navigator);

    this.navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((localMediaStream) => {
        console.log(localMediaStream);

        const nativeElement = this.video.nativeElement;
        nativeElement.srcObject = localMediaStream;
        nativeElement.play().catch(console.error);
      })
      .catch((err) => {
        console.error(`OH NO!!!`, err);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
