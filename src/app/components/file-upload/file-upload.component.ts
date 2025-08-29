import { Component, ElementRef, OnDestroy,  ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { Router, RouterModule } from '@angular/router';
import { TradeStatusUpdate } from '../../models/trade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [CommonModule, RouterModule],
  standalone: true,
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent implements OnDestroy {
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  activities: TradeStatusUpdate[] = [];
  color: string = '';
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  fileUploadSubscription: Subscription | undefined
  constructor(private uploadService: FileUploadService, private router: Router) {}

  ngOnDestroy(): void {
    this.fileUploadSubscription?.unsubscribe()
  }
  selectFile(event: any): void {
     const file: File = event.target.files[0];
     const fileExtension = file.name.split('.').pop();
    this.progress = 0;
    this.message = '';
    this.currentFile = event.target.files.item(0);
  }

  upload(): void {
    if (this.currentFile) {
      this.fileUploadSubscription = this.uploadService.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          console.log(err);
          this.currentFile = undefined;
          this.progress = 0;
        },
        complete: () => {
          this.currentFile = undefined;
          this.router.navigate(["/activity-feed"])
        }
      });
    }
  }
}
