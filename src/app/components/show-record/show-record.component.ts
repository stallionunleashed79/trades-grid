//import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { Trade } from '../../models/trade';
//import {MatPaginator} from '@angular/material/paginator';
//import {MatTableDataSource} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
 import { PageEvent } from '@angular/material/paginator';
 
@Component({
  selector: 'app-show-record',
  templateUrl: './show-record.component.html',
  styleUrl: './show-record.component.css'
})
export class ShowRecordComponent implements OnInit {
 trades: Trade[] | undefined;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
      pageIndex!:number;
pageSize!:number;
length!:number;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
//--
 // trades[]:Trade;
   ELEMENT_DATA1: Trade[] | any;
   dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
 users: Trade[] | undefined;
  //ELEMENT_DATA1: Observable<Object>;

  constructor(private uploadService: FileUploadService,
    private router: Router) { }
//  ngOnInit(): void {
  //  this.trades = this.uploadService.getAllRecords();
// }
ngOnInit(): void {
   // this.getRecords();
        this.pageSize=5;
    this.dataSource.paginator = this.paginator;
  }
//  ngOnInit() {
     //this.ELEMENT_DATA1 = this.uploadService.getAllRecords();
    // alert(this.trades[0].tradeId);

//  }
  // private getRecords() {
  //  this.uploadService.getAllRecords.subscribe(data => {
      //this.users = data;
    //});
//  }
}
  //tradeId?: number;
  //quantity?: number;
  //price?: number;
  //side?: string;
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  
}
const ELEMENT_DATA1: Trade[] = [] ;
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

