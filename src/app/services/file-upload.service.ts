import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Trade } from '../models/trade';
import { TradeStatusUpdate } from '../models/trade';
import { IGetRowsParams, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService implements IServerSideDatasource {
  private baseUrl = 'http://localhost:8081';
  private baseUrl1 = `${this.baseUrl}/api/trades/upload`;
  private eventSource?: EventSource;

  constructor(private http: HttpClient) { }
  getRows(params: IServerSideGetRowsParams<any, any>): void {
    const request = params.request;
    this.http.post<any>(`${this.baseUrl}/api/trades`, request)
      .pipe(
        map(response => ({ rows: response.rows, lastRow: response.lastRow }))
      ).subscribe(
        data => params.success(data.rows),
        fail => params.fail()
      )
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData(); 
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl1}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
     alert("===>>"+this.baseUrl1);
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl1}`);
  }

  getAllRecords(params: IGetRowsParams): Observable<Trade[]> {
    return this.http.post<Trade[]>(`${this.baseUrl}/api/trades`, params);
  }

  connectToStatusStream(): Observable<TradeStatusUpdate> {
    return new Observable(observer => {
      this.eventSource = new EventSource(`${this.baseUrl}/api/trades/status/stream`);
      
      this.eventSource.addEventListener('trade-status', (event) => {
        const update: TradeStatusUpdate = JSON.parse(event.data);
        observer.next(update);
      });

      this.eventSource.addEventListener('batch-progress', (event) => {
        const progress = JSON.parse(event.data);
        observer.next(progress);
      });

      this.eventSource.onerror = (error) => {
        observer.error(error);
      };
    });
  }
}