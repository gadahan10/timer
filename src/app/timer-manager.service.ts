import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import { tap, takeWhile } from 'rxjs/operators';
import * as TasksActions from './store/actions/tasks.actions';

@Injectable({
  providedIn: 'root',
})
export class TimerManagerService {
  readonly initialValue = 0;
  private timers: {
    id: number;
    subj$: BehaviorSubject<number>;
    isRunning: boolean;
  }[] = [];

  constructor(private ngZone: NgZone, private store: Store) {}
    
  getTimer(id: number): Observable<number> {
    const newTimer = this.createTimer();
    this.timers.push({ id, subj$: newTimer, isRunning: false });
    return newTimer.asObservable();
  }

  private createTimer() {
    return new BehaviorSubject<number>(this.initialValue);
  }

  public playTimer(id: number): void {
    const currentTimer = this.timers.find((x) => x.id === id);
    if (currentTimer) {
      currentTimer.isRunning = true;
      this.store.dispatch(TasksActions.PLAY_TASK({taskId: currentTimer.id}))
      timer(0, 1000)
        .pipe(
          takeWhile(() => currentTimer.isRunning),
          tap(() => {
            this.ngZone.run(() => {
              currentTimer.subj$.next(currentTimer.subj$.value + 1)
              this.store.dispatch(TasksActions.INCREMENT())
            })
          })
        ).subscribe();   
    }
  }

  public pauseTimer(id: number): void {
    const curr = this.timers.find((x) => x.id === id);
    if (curr) {
      curr.isRunning = false;      
      this.store.dispatch(TasksActions.PAUSE_TASK())
    }
  }
}
