import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { Router, RouterModule } from '@angular/router';
import { Trade } from '../../models/trade';
import { TradeStatusUpdate } from '../../models/trade';
import { Subscription } from 'rxjs';
import type {
  ColDef,
  GridReadyEvent,
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridModule } from 'ag-grid-angular';
type IRow = Trade
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [CommonModule, AgGridModule, RouterModule],
  standalone: true,
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent implements OnInit, OnDestroy {
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  activities: TradeStatusUpdate[] = [];
  trades: Trade[] = [];
  color: string = '';
  tradeStatusSubscription: Subscription | undefined
  columnDefs: any[];
  rowData: Trade[] = []
  gridOptions: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  defaultColDef: ColDef = {
    filter: true,
    editable: true
  };

  constructor(private uploadService: FileUploadService, private router: Router) {
    this.columnDefs = [
          { headerName: 'Trade ID', field: 'tradeId' },
          { headerName: 'Symbol', field: 'symbol' },
          { headerName: 'Quantity', field: 'quantity' },
          { headerName: 'Price', field: 'price' },
          { headerName: 'Side', field: 'side' },
          { headerName: 'Status', field: 'status' },
          { headerName: 'Trader ID', field: 'traderId' }
      ] as ColDef<IRow>[]
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
    this.tradeStatusSubscription = this.uploadService.connectToStatusStream()
      .subscribe(update => {
        this.addActivity(update);
      });
  }

  ngOnDestroy(): void {
    this.tradeStatusSubscription?.unsubscribe();
  }

  private addActivity(update: TradeStatusUpdate) {
    this.activities.unshift(update);
    
    // Keep only last 50 activities
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }
    
    // Auto-scroll to top for new activities
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop = 0;
    });
  }

  getStatusMessage(activity: TradeStatusUpdate): string {
    switch (activity.status) {
      case 'UPLOADED': return 'File uploaded successfully';
      case 'VALIDATED': return 'Validation completed';
      case 'VALIDATION_FAILED': return 'Validation failed';
      case 'SETTLED': return 'Settlement completed';
      case 'FAILED': return activity.errorMessage || 'Processing failed';
      default: return 'Unknown status';
    } 
  }
  getStatusColor(activity: any){
    return "yellow";
  }

  getActivityClass(status: string | undefined): string {
    switch (status) {
      case 'UPLOADED': return 'activity-class';
      case 'VALIDATED': return 'activity-class';
      case 'VALIDATION_FAILED': return 'activity-class';
      case 'SETTLED': return 'activity-class';
      case 'FAILED': return 'activity-class';
      default: return 'Unknown status';
    } 
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
      this.uploadService.upload(this.currentFile).subscribe({
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
        }
      });
    }
  }
   onGridReady(params: GridReadyEvent) {
     this.initializeData();
    }

  private initializeData() {
    this.uploadService.getAllRecords()
      .subscribe(result => {
        this.rowData = result;
        console.log(`TRADES ${JSON.stringify(this.trades)}`);
      });
  }
}
