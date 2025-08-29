import { Component, ElementRef, OnDestroy, OnInit, ViewChild
   } from '@angular/core';
import { Trade } from '../../models/trade';
import { TradeStatusUpdate } from '../../models/trade';
import { FileUploadService } from '../../services/file-upload.service';
import { Subscription } from 'rxjs';
import type {
  ColDef,
  GridReadyEvent,
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
type IRow = Trade

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.css'
})
export class ActivityFeedComponent implements OnInit, OnDestroy {
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
  
  constructor(private uploadService: FileUploadService){
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
  ngOnDestroy(): void {
    this.tradeStatusSubscription?.unsubscribe();
  }
  ngOnInit() {
    this.tradeStatusSubscription = this.uploadService.connectToStatusStream()
      .subscribe(update => {
        this.addActivity(update);
      });
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

   onGridReady(params: GridReadyEvent) {
     this.uploadService.getAllRecords()
      .subscribe(result => {
        this.rowData = result;
        console.log(`TRADES ${JSON.stringify(this.trades)}`)
      });
    }
}
