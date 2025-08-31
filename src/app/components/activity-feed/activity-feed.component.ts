import { Component, ElementRef, OnDestroy, OnInit, ViewChild
   } from '@angular/core';
import { Trade } from '../../models/trade';
import { TradeStatusUpdate } from '../../models/trade';
import { FileUploadService } from '../../services/file-upload.service';
import { map, Observable, Subscription } from 'rxjs';
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  IGetRowsParams
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { TradeFilter } from '../../models/trade.filter';
import { TradeStatus } from '../../models/trade.status';

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
    editable: true,
    width: 160
  };
  gridApi!: GridApi
  filterModel : TradeFilter = {}
  tradeStatus = TradeStatus

  constructor(private uploadService: FileUploadService){
    this.columnDefs = [
          { headerName: 'Trade ID', field: 'tradeId', filter: 'agTextColumnFilter' },
          { headerName: 'Symbol', field: 'symbol' },
          { headerName: 'Quantity', field: 'quantity' },
          { headerName: 'Price', field: 'price' },
          { headerName: 'Side', field: 'side' },
          { headerName: 'Status', field: 'status' },
          { headerName: 'Trader ID', field: 'traderId' },
          { headerName: 'Trade Date', field: 'tradeDate'}
      ] as ColDef<IRow>[]

    this.gridOptions = {
      rowSelection: 'single',
      cacheBlockSize: 100,
      maxBlocksInCache: 2,
      rowModelType: 'infinite',
      pagination: true, 
      paginationAutoPageSize: true
    };

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
  
  performSearch() {
    console.log(`FILTER MODEL ${JSON.stringify(this.filterModel)}`)
    this.gridApi.setGridOption('datasource', this.createServerSideDatasource());
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

    private getRowData(params: IGetRowsParams): Observable<any> {
      return this.uploadService.getAllRecords(params)
          .pipe(
              map((res: any) => {
                console.log(`RESPONSE ${JSON.stringify(res)}`)
                return res.data
              })
            );
    }

    createServerSideDatasource(){
      return {
        getRows: (params: IGetRowsParams) => {
          params = {...params, filterModel: this.filterModel }
          this.getRowData(params).subscribe(data => 
            params.successCallback(data));
        }
      };
    }

    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.gridApi.setGridOption('datasource', this.createServerSideDatasource());
    }
}
