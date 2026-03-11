import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {
  private refreshTrigger = new BehaviorSubject<number>(0);
  
  // Observable that components can subscribe to
  public refresh$ = this.refreshTrigger.asObservable();
  
  // Method to trigger refresh
  triggerRefresh() {
    this.refreshTrigger.next(this.refreshTrigger.value + 1);
  }
}


