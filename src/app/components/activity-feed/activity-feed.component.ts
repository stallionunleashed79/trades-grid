import { Component, ElementRef, OnInit,ViewChild} from '@angular/core';
import { Trade } from '../../models/trade.model';
import { Tradestatusupdate } from '../../models/tradestatusupdate';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
@Component({
  selector: 'activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.css'
})
export class ActivityFeedComponent implements OnInit{
  activities: Tradestatusupdate[] = [];
   color: string = '';
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
    constructor(private uploadService: FileUploadService,
      private router: Router) { }
  ngOnInit() {
    this.uploadService.connectToStatusStream()
      .subscribe(update => {
        this.addActivity(update);
      });
  }
  
  private addActivity(update: Tradestatusupdate) {
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
  
  getStatusMessage(activity: Tradestatusupdate): string {
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
}
